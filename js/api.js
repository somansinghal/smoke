// SmogWise Unified API Service
// Integrates Open-Meteo (Geocoding & Weather & Air Model) and WAQI (Ground Stations)

const SMOGWISE_API = {
  /**
   * Search locations using Open-Meteo Geocoding
   */
  searchLocations: async function(query) {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const url = `${CONFIG.API.GEOCODING}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Geocoding HTTP error: ${response.status}`);
      const data = await response.json();
      
      if (!data.results || !data.results.length) return [];
      
      return data.results.map(r => ({
        id: `${r.latitude}_${r.longitude}`,
        name: r.name,
        country: r.country || '',
        admin1: r.admin1 || '',
        lat: r.latitude,
        lng: r.longitude,
        displayName: [r.name, r.admin1, r.country].filter(Boolean).join(', ')
      }));
    } catch (err) {
      console.warn('[SmogWise API] Geocoding search failed:', err.message);
      return [];
    }
  },

  /**
   * Fetch local weather using Open-Meteo
   */
  fetchWeather: async function(lat, lng) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m,weather_code',
      forecast_days: '2',
      timezone: 'auto'
    });

    const response = await fetch(`${CONFIG.API.WEATHER}?${params.toString()}`);
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    const data = await response.json();

    const current = data.current || {};
    const weatherCode = current.weather_code || 0;
    const conditionInfo = this.getWeatherCondition(weatherCode);

    // Parse next 12 hours
    const hourlyData = [];
    if (data.hourly && data.hourly.time) {
      const nowIdx = 0; // starts from current or hour 0
      for (let i = nowIdx; i < Math.min(data.hourly.time.length, nowIdx + 12); i++) {
        const timeStr = data.hourly.time[i];
        const dateObj = new Date(timeStr);
        const hourLabel = i === nowIdx ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });
        hourlyData.push({
          time: timeStr,
          hour: hourLabel,
          temp: Math.round(data.hourly.temperature_2m[i]),
          humidity: Math.round(data.hourly.relative_humidity_2m[i]),
          windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
          rainProb: Math.round(data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] : 0),
          weatherCode: data.hourly.weather_code[i]
        });
      }
    }

    return {
      temperature: Math.round(current.temperature_2m ?? 20),
      apparentTemperature: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 20),
      humidity: Math.round(current.relative_humidity_2m ?? 50),
      windSpeed: Math.round(current.wind_speed_10m ?? 10),
      windDirection: this.degToCompass(current.wind_direction_10m ?? 0),
      precipitation: current.precipitation ?? 0.0,
      weatherCode: weatherCode,
      condition: conditionInfo.text,
      conditionIcon: conditionInfo.icon,
      hourly: hourlyData
    };
  },

  /**
   * Fetch Air Quality from WAQI ground station, with automatic fallback to Open-Meteo CAMS forecast
   */
  fetchAirQuality: async function(lat, lng, customToken = null) {
    const token = customToken || localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_WAQI_TOKEN) || CONFIG.DEFAULT_WAQI_TOKEN;
    
    // Attempt WAQI first for official ground station measurement
    let waqiResult = null;
    try {
      const waqiUrl = `${CONFIG.API.WAQI_FEED}/geo:${lat};${lng}/?token=${token}`;
      const res = await fetch(waqiUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'ok' && json.data) {
          waqiResult = json.data;
        }
      }
    } catch (err) {
      console.warn('[SmogWise API] WAQI request failed, checking fallback:', err.message);
    }

    // Always fetch Open-Meteo Air Quality Model for hourly trends & backup
    let openMeteoAq = null;
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lng,
        current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi',
        hourly: 'pm2_5,pm10,us_aqi,ozone,nitrogen_dioxide',
        forecast_days: '2',
        timezone: 'auto'
      });
      const res = await fetch(`${CONFIG.API.AIR_QUALITY_FORECAST}?${params.toString()}`);
      if (res.ok) {
        openMeteoAq = await res.json();
      }
    } catch (err) {
      console.warn('[SmogWise API] Open-Meteo AQ model fetch failed:', err.message);
    }

    // If WAQI succeeded and has a valid AQI
    if (waqiResult && typeof waqiResult.aqi === 'number') {
      const iaqi = waqiResult.iaqi || {};
      
      const pollutants = {
        pm25: {
          value: iaqi.pm25 ? iaqi.pm25.v : (openMeteoAq?.current?.pm2_5 ?? null),
          unit: 'µg/m³',
          aqi: iaqi.pm25 ? iaqi.pm25.v : null
        },
        pm10: {
          value: iaqi.pm10 ? iaqi.pm10.v : (openMeteoAq?.current?.pm10 ?? null),
          unit: 'µg/m³',
          aqi: iaqi.pm10 ? iaqi.pm10.v : null
        },
        o3: {
          value: iaqi.o3 ? iaqi.o3.v : (openMeteoAq?.current?.ozone ?? null),
          unit: 'µg/m³',
          aqi: iaqi.o3 ? iaqi.o3.v : null
        },
        no2: {
          value: iaqi.no2 ? iaqi.no2.v : (openMeteoAq?.current?.nitrogen_dioxide ?? null),
          unit: 'µg/m³',
          aqi: iaqi.no2 ? iaqi.no2.v : null
        },
        so2: {
          value: iaqi.so2 ? iaqi.so2.v : (openMeteoAq?.current?.sulphur_dioxide ?? null),
          unit: 'µg/m³',
          aqi: iaqi.so2 ? iaqi.so2.v : null
        },
        co: {
          value: iaqi.co ? (iaqi.co.v > 100 ? (iaqi.co.v / 1000).toFixed(1) : iaqi.co.v) : (openMeteoAq?.current?.carbon_monoxide ? (openMeteoAq.current.carbon_monoxide / 1000).toFixed(1) : null),
          unit: 'mg/m³',
          aqi: iaqi.co ? iaqi.co.v : null
        }
      };

      // Hourly projection from Open-Meteo Air Quality Model
      const hourlyTrends = this.extractHourlyAq(openMeteoAq);

      const attributions = Array.isArray(waqiResult.attributions) ? waqiResult.attributions : [];
      const primaryProvider = attributions.find(a => !a.name.toLowerCase().includes('world air quality')) || attributions[0];

      return {
        aqi: waqiResult.aqi,
        dominantPollutant: waqiResult.dominentpol || 'pm25',
        pollutants: pollutants,
        station: {
          name: waqiResult.city?.name || 'Local Ground Monitoring Station',
          isLiveStation: true,
          stationType: 'Live Ground Monitoring Station',
          sourceNotice: 'Live Ground Measurement (WAQI Feed)',
          provider: primaryProvider?.name || 'Regional Environmental Protection Agency',
          providerUrl: primaryProvider?.url || 'https://waqi.info/',
          scale: 'US EPA Air Quality Index (AQI)',
          lastUpdated: waqiResult.time?.s ? this.formatTimeAgo(waqiResult.time.s) : 'Recently',
          rawTime: waqiResult.time?.s || new Date().toISOString()
        },
        attributions: [
          { name: 'World Air Quality Index Project (WAQI)', url: 'https://waqi.info/' },
          ...attributions
        ],
        hourlyAq: hourlyTrends
      };
    }

    // Fallback: If WAQI is not available, use Open-Meteo CAMS Model
    if (openMeteoAq && openMeteoAq.current) {
      const cur = openMeteoAq.current;
      const modelAqi = cur.us_aqi != null ? Math.round(cur.us_aqi) : this.calculateAqiFromPm25(cur.pm2_5);
      const hourlyTrends = this.extractHourlyAq(openMeteoAq);

      return {
        aqi: modelAqi,
        dominantPollutant: 'pm25',
        pollutants: {
          pm25: { value: cur.pm2_5 != null ? Math.round(cur.pm2_5 * 10) / 10 : null, unit: 'µg/m³', aqi: modelAqi },
          pm10: { value: cur.pm10 != null ? Math.round(cur.pm10 * 10) / 10 : null, unit: 'µg/m³', aqi: null },
          o3: { value: cur.ozone != null ? Math.round(cur.ozone * 10) / 10 : null, unit: 'µg/m³', aqi: null },
          no2: { value: cur.nitrogen_dioxide != null ? Math.round(cur.nitrogen_dioxide * 10) / 10 : null, unit: 'µg/m³', aqi: null },
          so2: { value: cur.sulphur_dioxide != null ? Math.round(cur.sulphur_dioxide * 10) / 10 : null, unit: 'µg/m³', aqi: null },
          co: { value: cur.carbon_monoxide != null ? (cur.carbon_monoxide / 1000).toFixed(1) : null, unit: 'mg/m³', aqi: null }
        },
        station: {
          name: 'Copernicus Atmospheric Model (CAMS)',
          isLiveStation: false,
          stationType: 'Numerical Atmospheric Forecast Model',
          sourceNotice: 'Numerical Forecast Model (Copernicus CAMS via Open-Meteo) — Projected estimate, not a real-time ground sensor measurement',
          provider: 'Copernicus Atmosphere Monitoring Service (ECMWF) & Open-Meteo',
          providerUrl: 'https://atmosphere.copernicus.eu/',
          scale: 'US EPA Air Quality Index (AQI)',
          lastUpdated: 'Modeled forecast cycle (updated every 6 hours)',
          rawTime: new Date().toISOString()
        },
        attributions: [
          { name: 'Copernicus Atmosphere Monitoring Service (CAMS)', url: 'https://atmosphere.copernicus.eu/' },
          { name: 'Open-Meteo Air Quality API', url: 'https://open-meteo.com/' }
        ],
        hourlyAq: hourlyTrends
      };
    }

    throw new Error('Both WAQI station data and Open-Meteo model data are currently unreachable.');
  },

  /**
   * Helper: extract hourly AQ trend from Open-Meteo
   */
  extractHourlyAq: function(openMeteoAq) {
    if (!openMeteoAq || !openMeteoAq.hourly || !openMeteoAq.hourly.time) return [];
    const times = openMeteoAq.hourly.time;
    const aqiList = openMeteoAq.hourly.us_aqi || [];
    const pm25List = openMeteoAq.hourly.pm2_5 || [];
    const trends = [];

    for (let i = 0; i < Math.min(times.length, 12); i++) {
      const d = new Date(times[i]);
      trends.push({
        hour: i === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric' }),
        aqi: aqiList[i] != null ? Math.round(aqiList[i]) : 50,
        pm25: pm25List[i] != null ? Math.round(pm25List[i] * 10) / 10 : 15
      });
    }
    return trends;
  },

  /**
   * Approximate US AQI from PM2.5 (µg/m³)
   */
  calculateAqiFromPm25: function(pm25) {
    if (pm25 == null || isNaN(pm25)) return 50;
    const c = Number(pm25);
    if (c <= 12.0) return Math.round((50 / 12.0) * c);
    if (c <= 35.4) return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (c - 12.1));
    if (c <= 55.4) return Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (c - 35.5));
    if (c <= 150.4) return Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (c - 55.5));
    if (c <= 250.4) return Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (c - 150.5));
    if (c <= 350.4) return Math.round(301 + ((400 - 301) / (350.4 - 250.5)) * (c - 250.5));
    return Math.round(401 + ((500 - 401) / (500.4 - 350.5)) * (c - 350.5));
  },

  /**
   * Format human relative time
   */
  formatTimeAgo: function(timeStr) {
    try {
      const then = new Date(timeStr);
      const diffMin = Math.round((Date.now() - then.getTime()) / (60 * 1000));
      if (isNaN(diffMin)) return timeStr;
      if (diffMin <= 5) return 'Just now';
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return then.toLocaleDateString();
    } catch (e) {
      return timeStr;
    }
  },

  /**
   * Convert wind degrees to compass direction
   */
  degToCompass: function(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
  },

  /**
   * Weather code map according to WMO Weather interpretation codes
   */
  getWeatherCondition: function(code) {
    const table = {
      0: { text: 'Clear Sky', icon: '☀️' },
      1: { text: 'Mainly Clear', icon: '🌤️' },
      2: { text: 'Partly Cloudy', icon: '⛅' },
      3: { text: 'Overcast', icon: '☁️' },
      45: { text: 'Foggy / Hazy', icon: '🌫️' },
      48: { text: 'Depositing Rime Fog', icon: '🌫️' },
      51: { text: 'Light Drizzle', icon: '🌦️' },
      53: { text: 'Moderate Drizzle', icon: '🌦️' },
      55: { text: 'Dense Drizzle', icon: '🌧️' },
      61: { text: 'Slight Rain', icon: '🌧️' },
      63: { text: 'Moderate Rain', icon: '🌧️' },
      65: { text: 'Heavy Rain', icon: '🌧️' },
      71: { text: 'Slight Snow', icon: '🌨️' },
      73: { text: 'Moderate Snow', icon: '🌨️' },
      75: { text: 'Heavy Snow', icon: '❄️' },
      80: { text: 'Rain Showers', icon: '🌦️' },
      81: { text: 'Moderate Showers', icon: '🌧️' },
      82: { text: 'Violent Showers', icon: '⛈️' },
      95: { text: 'Thunderstorm', icon: '⛈️' }
    };
    return table[code] || { text: 'Fair Weather', icon: '🌤️' };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SMOGWISE_API;
}
