// Preset Demo Data for all 5 AQI categories, offline use, and repeatable testing

const DEMO_DATA = {
  good: {
    id: 'good',
    name: 'Honolulu, Hawaii (Clean Coastal)',
    cityName: 'Honolulu, USA',
    lat: 21.3069,
    lng: -157.8583,
    station: {
      name: 'Honolulu Ocean View Station #4',
      provider: 'Hawaii Dept of Health & US EPA AirNow',
      providerUrl: 'https://health.hawaii.gov/cab/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: true,
      lastUpdated: '12 minutes ago'
    },
    aqi: 24,
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: { value: 5.8, unit: 'µg/m³', aqi: 24 },
      pm10: { value: 12.0, unit: 'µg/m³', aqi: 11 },
      o3: { value: 28.4, unit: 'µg/m³', aqi: 26 },
      no2: { value: 8.2, unit: 'µg/m³', aqi: 8 },
      so2: { value: 2.1, unit: 'µg/m³', aqi: 3 },
      co: { value: 0.3, unit: 'mg/m³', aqi: 4 }
    },
    weather: {
      temperature: 25,
      apparentTemperature: 26,
      humidity: 62,
      windSpeed: 18,
      windDirection: 'ENE',
      precipitation: 0.0,
      condition: 'Partly Cloudy',
      weatherCode: 2
    },
    hourly: [
      { hour: 'Now', temp: 25, aqi: 24, pm25: 5.8, rainProb: 5 },
      { hour: '+1h', temp: 25, aqi: 23, pm25: 5.5, rainProb: 5 },
      { hour: '+2h', temp: 26, aqi: 25, pm25: 6.0, rainProb: 10 },
      { hour: '+3h', temp: 26, aqi: 26, pm25: 6.2, rainProb: 10 },
      { hour: '+4h', temp: 25, aqi: 24, pm25: 5.9, rainProb: 5 },
      { hour: '+5h', temp: 24, aqi: 22, pm25: 5.3, rainProb: 5 },
      { hour: '+6h', temp: 23, aqi: 21, pm25: 5.1, rainProb: 0 },
      { hour: '+7h', temp: 22, aqi: 20, pm25: 4.8, rainProb: 0 }
    ]
  },

  moderate: {
    id: 'moderate',
    name: 'London, UK (Typical Urban)',
    cityName: 'London, United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    station: {
      name: 'London Westminster Marylebone Road',
      provider: 'UK Department for Environment, Food and Rural Affairs (DEFRA)',
      providerUrl: 'https://uk-air.defra.gov.uk/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: true,
      lastUpdated: '18 minutes ago'
    },
    aqi: 72,
    dominantPollutant: 'no2',
    pollutants: {
      pm25: { value: 21.4, unit: 'µg/m³', aqi: 70 },
      pm10: { value: 38.5, unit: 'µg/m³', aqi: 36 },
      o3: { value: 42.1, unit: 'µg/m³', aqi: 39 },
      no2: { value: 64.8, unit: 'µg/m³', aqi: 72 },
      so2: { value: 9.3, unit: 'µg/m³', aqi: 13 },
      co: { value: 0.9, unit: 'mg/m³', aqi: 10 }
    },
    weather: {
      temperature: 15,
      apparentTemperature: 14,
      humidity: 78,
      windSpeed: 12,
      windDirection: 'SW',
      precipitation: 0.2,
      condition: 'Overcast & Light Breeze',
      weatherCode: 3
    },
    hourly: [
      { hour: 'Now', temp: 15, aqi: 72, pm25: 21.4, rainProb: 30 },
      { hour: '+1h', temp: 16, aqi: 75, pm25: 22.8, rainProb: 25 },
      { hour: '+2h', temp: 16, aqi: 78, pm25: 24.1, rainProb: 20 },
      { hour: '+3h', temp: 15, aqi: 70, pm25: 20.9, rainProb: 35 },
      { hour: '+4h', temp: 14, aqi: 65, pm25: 19.2, rainProb: 40 },
      { hour: '+5h', temp: 13, aqi: 62, pm25: 18.0, rainProb: 45 },
      { hour: '+6h', temp: 12, aqi: 60, pm25: 17.4, rainProb: 30 },
      { hour: '+7h', temp: 11, aqi: 58, pm25: 16.8, rainProb: 20 }
    ]
  },

  sensitive: {
    id: 'sensitive',
    name: 'Los Angeles, CA (Warm Valley Ozone & Smog)',
    cityName: 'Los Angeles, USA',
    lat: 34.0522,
    lng: -118.2437,
    station: {
      name: 'Downtown LA South Coast AQMD Station',
      provider: 'South Coast Air Quality Management District (SCAQMD)',
      providerUrl: 'http://www.aqmd.gov/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: true,
      lastUpdated: '25 minutes ago'
    },
    aqi: 128,
    dominantPollutant: 'o3',
    pollutants: {
      pm25: { value: 39.2, unit: 'µg/m³', aqi: 110 },
      pm10: { value: 68.0, unit: 'µg/m³', aqi: 57 },
      o3: { value: 148.6, unit: 'µg/m³', aqi: 128 },
      no2: { value: 52.3, unit: 'µg/m³', aqi: 49 },
      so2: { value: 4.8, unit: 'µg/m³', aqi: 6 },
      co: { value: 1.2, unit: 'mg/m³', aqi: 14 }
    },
    weather: {
      temperature: 31,
      apparentTemperature: 33,
      humidity: 44,
      windSpeed: 7,
      windDirection: 'WSW',
      precipitation: 0.0,
      condition: 'Hot & Sunny Smog',
      weatherCode: 1
    },
    hourly: [
      { hour: 'Now', temp: 31, aqi: 128, pm25: 39.2, rainProb: 0 },
      { hour: '+1h', temp: 32, aqi: 135, pm25: 41.0, rainProb: 0 },
      { hour: '+2h', temp: 32, aqi: 142, pm25: 43.5, rainProb: 0 },
      { hour: '+3h', temp: 30, aqi: 130, pm25: 38.0, rainProb: 0 },
      { hour: '+4h', temp: 28, aqi: 118, pm25: 34.5, rainProb: 0 },
      { hour: '+5h', temp: 25, aqi: 98, pm25: 29.0, rainProb: 0 },
      { hour: '+6h', temp: 23, aqi: 85, pm25: 25.4, rainProb: 0 },
      { hour: '+7h', temp: 21, aqi: 76, pm25: 23.0, rainProb: 0 }
    ]
  },

  unhealthy: {
    id: 'unhealthy',
    name: 'New Delhi, India (Winter Thermal Inversion & PM2.5)',
    cityName: 'New Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    station: {
      name: 'Anand Vihar Clean Air Station DPCC',
      provider: 'Delhi Pollution Control Committee (DPCC) / CPCB',
      providerUrl: 'https://airquality.cpcb.gov.in/AQI_India/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: true,
      lastUpdated: '15 minutes ago'
    },
    aqi: 188,
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: { value: 128.4, unit: 'µg/m³', aqi: 188 },
      pm10: { value: 242.0, unit: 'µg/m³', aqi: 144 },
      o3: { value: 41.0, unit: 'µg/m³', aqi: 38 },
      no2: { value: 92.4, unit: 'µg/m³', aqi: 98 },
      so2: { value: 18.5, unit: 'µg/m³', aqi: 26 },
      co: { value: 2.8, unit: 'mg/m³', aqi: 32 }
    },
    weather: {
      temperature: 19,
      apparentTemperature: 19,
      humidity: 84,
      windSpeed: 4,
      windDirection: 'NW',
      precipitation: 0.0,
      condition: 'Dense Hazy Smog & Calm Winds',
      weatherCode: 45
    },
    hourly: [
      { hour: 'Now', temp: 19, aqi: 188, pm25: 128.4, rainProb: 0 },
      { hour: '+1h', temp: 21, aqi: 194, pm25: 134.0, rainProb: 0 },
      { hour: '+2h', temp: 22, aqi: 198, pm25: 142.0, rainProb: 0 },
      { hour: '+3h', temp: 23, aqi: 190, pm25: 131.0, rainProb: 0 },
      { hour: '+4h', temp: 21, aqi: 185, pm25: 124.0, rainProb: 0 },
      { hour: '+5h', temp: 19, aqi: 192, pm25: 135.0, rainProb: 0 },
      { hour: '+6h', temp: 17, aqi: 205, pm25: 154.0, rainProb: 0 },
      { hour: '+7h', temp: 16, aqi: 218, pm25: 168.0, rainProb: 0 }
    ]
  },

  hazardous: {
    id: 'hazardous',
    name: 'Wildfire Smoke Episode / Severe Stagnation',
    cityName: 'Regional Smoke Plume Event',
    lat: 38.5816,
    lng: -121.4944,
    station: {
      name: 'Forestry Emergency Mobile Station #2',
      provider: 'Interagency Wildland Fire Air Quality Response Program',
      providerUrl: 'https://www.wildlandfiresmoke.net/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: true,
      lastUpdated: '5 minutes ago'
    },
    aqi: 348,
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: { value: 298.5, unit: 'µg/m³', aqi: 348 },
      pm10: { value: 412.0, unit: 'µg/m³', aqi: 280 },
      o3: { value: 55.0, unit: 'µg/m³', aqi: 52 },
      no2: { value: 68.0, unit: 'µg/m³', aqi: 65 },
      so2: { value: 34.0, unit: 'µg/m³', aqi: 48 },
      co: { value: 9.8, unit: 'mg/m³', aqi: 95 }
    },
    weather: {
      temperature: 28,
      apparentTemperature: 29,
      humidity: 22,
      windSpeed: 6,
      windDirection: 'NE',
      precipitation: 0.0,
      condition: 'Dense Wildfire Smoke Veil',
      weatherCode: 45
    },
    hourly: [
      { hour: 'Now', temp: 28, aqi: 348, pm25: 298.5, rainProb: 0 },
      { hour: '+1h', temp: 29, aqi: 360, pm25: 312.0, rainProb: 0 },
      { hour: '+2h', temp: 29, aqi: 375, pm25: 330.0, rainProb: 0 },
      { hour: '+3h', temp: 27, aqi: 355, pm25: 305.0, rainProb: 0 },
      { hour: '+4h', temp: 25, aqi: 340, pm25: 290.0, rainProb: 0 },
      { hour: '+5h', temp: 23, aqi: 330, pm25: 280.0, rainProb: 0 },
      { hour: '+6h', temp: 21, aqi: 320, pm25: 270.0, rainProb: 0 },
      { hour: '+7h', temp: 20, aqi: 310, pm25: 260.0, rainProb: 0 }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEMO_DATA;
}
