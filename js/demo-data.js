// Preset Demo Data for all 5 AQI categories (India Locations Only)
// Clearly identified as simulated sample/demo scenarios for demonstration and offline testing

const DEMO_DATA = {
  good: {
    id: 'good',
    name: 'Munnar, Kerala (Clean Hill Station & Western Ghats)',
    cityName: 'Munnar, Kerala, India',
    lat: 10.0889,
    lng: 77.0595,
    station: {
      name: 'Munnar High Altitude Ambient Station (KSPCB / CPCB)',
      provider: 'Kerala State Pollution Control Board & CPCB Network',
      providerUrl: 'https://airquality.cpcb.gov.in/AQI_India/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: false,
      isDemo: true,
      stationType: 'Sample / Demo Station Data',
      sourceNotice: 'Sample / Demo Scenario (India) — Simulated test data, not a live measurement',
      lastUpdated: 'Sample Scenario'
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
      temperature: 20,
      apparentTemperature: 20,
      humidity: 64,
      windSpeed: 10,
      windDirection: 'ENE',
      precipitation: 0.0,
      condition: 'Pleasant & Mountain Breeze',
      weatherCode: 1
    },
    hourly: [
      { hour: 'Now', temp: 20, aqi: 24, pm25: 5.8, rainProb: 0 },
      { hour: '+1h', temp: 21, aqi: 23, pm25: 5.5, rainProb: 0 },
      { hour: '+2h', temp: 22, aqi: 25, pm25: 6.0, rainProb: 5 },
      { hour: '+3h', temp: 22, aqi: 26, pm25: 6.2, rainProb: 5 },
      { hour: '+4h', temp: 21, aqi: 24, pm25: 5.9, rainProb: 0 },
      { hour: '+5h', temp: 20, aqi: 22, pm25: 5.3, rainProb: 0 },
      { hour: '+6h', temp: 19, aqi: 21, pm25: 5.1, rainProb: 0 },
      { hour: '+7h', temp: 18, aqi: 20, pm25: 4.8, rainProb: 0 }
    ]
  },

  moderate: {
    id: 'moderate',
    name: 'Bengaluru, Karnataka (Typical Urban Plateau)',
    cityName: 'Bengaluru, Karnataka, India',
    lat: 12.9716,
    lng: 77.5946,
    station: {
      name: 'BTM Layout Ambient Air Station (KSPCB)',
      provider: 'Karnataka State Pollution Control Board (KSPCB)',
      providerUrl: 'https://kspcb.karnataka.gov.in/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: false,
      isDemo: true,
      stationType: 'Sample / Demo Station Data',
      sourceNotice: 'Sample / Demo Scenario (India) — Simulated test data, not a live measurement',
      lastUpdated: 'Sample Scenario'
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
      temperature: 24,
      apparentTemperature: 24,
      humidity: 58,
      windSpeed: 12,
      windDirection: 'E',
      precipitation: 0.0,
      condition: 'Partly Cloudy & Light Breeze',
      weatherCode: 2
    },
    hourly: [
      { hour: 'Now', temp: 24, aqi: 72, pm25: 21.4, rainProb: 10 },
      { hour: '+1h', temp: 25, aqi: 75, pm25: 22.8, rainProb: 10 },
      { hour: '+2h', temp: 26, aqi: 78, pm25: 24.1, rainProb: 15 },
      { hour: '+3h', temp: 25, aqi: 70, pm25: 20.9, rainProb: 10 },
      { hour: '+4h', temp: 24, aqi: 65, pm25: 19.2, rainProb: 5 },
      { hour: '+5h', temp: 23, aqi: 62, pm25: 18.0, rainProb: 0 },
      { hour: '+6h', temp: 22, aqi: 60, pm25: 17.4, rainProb: 0 },
      { hour: '+7h', temp: 21, aqi: 58, pm25: 16.8, rainProb: 0 }
    ]
  },

  sensitive: {
    id: 'sensitive',
    name: 'Mumbai, Maharashtra (Coastal Urban Air)',
    cityName: 'Mumbai, Maharashtra, India',
    lat: 19.0760,
    lng: 72.8777,
    station: {
      name: 'Bandra Kurla Complex (BKC) Monitoring Station (MPCB)',
      provider: 'Maharashtra Pollution Control Board (MPCB)',
      providerUrl: 'https://mpcb.gov.in/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: false,
      isDemo: true,
      stationType: 'Sample / Demo Station Data',
      sourceNotice: 'Sample / Demo Scenario (India) — Simulated test data, not a live measurement',
      lastUpdated: 'Sample Scenario'
    },
    aqi: 128,
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: { value: 46.2, unit: 'µg/m³', aqi: 128 },
      pm10: { value: 88.0, unit: 'µg/m³', aqi: 68 },
      o3: { value: 58.6, unit: 'µg/m³', aqi: 55 },
      no2: { value: 52.3, unit: 'µg/m³', aqi: 49 },
      so2: { value: 12.8, unit: 'µg/m³', aqi: 16 },
      co: { value: 1.2, unit: 'mg/m³', aqi: 14 }
    },
    weather: {
      temperature: 30,
      apparentTemperature: 34,
      humidity: 76,
      windSpeed: 9,
      windDirection: 'WSW',
      precipitation: 0.0,
      condition: 'Warm Coastal Haze',
      weatherCode: 1
    },
    hourly: [
      { hour: 'Now', temp: 30, aqi: 128, pm25: 46.2, rainProb: 0 },
      { hour: '+1h', temp: 31, aqi: 135, pm25: 49.0, rainProb: 0 },
      { hour: '+2h', temp: 31, aqi: 140, pm25: 52.5, rainProb: 0 },
      { hour: '+3h', temp: 29, aqi: 130, pm25: 47.0, rainProb: 0 },
      { hour: '+4h', temp: 28, aqi: 118, pm25: 42.5, rainProb: 0 },
      { hour: '+5h', temp: 27, aqi: 105, pm25: 37.0, rainProb: 0 },
      { hour: '+6h', temp: 26, aqi: 95, pm25: 33.4, rainProb: 0 },
      { hour: '+7h', temp: 26, aqi: 88, pm25: 30.0, rainProb: 0 }
    ]
  },

  unhealthy: {
    id: 'unhealthy',
    name: 'New Delhi, India (Winter Thermal Inversion & PM2.5)',
    cityName: 'New Delhi, Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    station: {
      name: 'Anand Vihar Clean Air Station (DPCC / CPCB)',
      provider: 'Delhi Pollution Control Committee (DPCC) / CPCB',
      providerUrl: 'https://airquality.cpcb.gov.in/AQI_India/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: false,
      isDemo: true,
      stationType: 'Sample / Demo Station Data',
      sourceNotice: 'Sample / Demo Scenario (India) — Simulated test data, not a live measurement',
      lastUpdated: 'Sample Scenario'
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
      temperature: 18,
      apparentTemperature: 18,
      humidity: 82,
      windSpeed: 4,
      windDirection: 'NW',
      precipitation: 0.0,
      condition: 'Dense Hazy Smog & Calm Winds',
      weatherCode: 45
    },
    hourly: [
      { hour: 'Now', temp: 18, aqi: 188, pm25: 128.4, rainProb: 0 },
      { hour: '+1h', temp: 20, aqi: 194, pm25: 134.0, rainProb: 0 },
      { hour: '+2h', temp: 21, aqi: 198, pm25: 142.0, rainProb: 0 },
      { hour: '+3h', temp: 21, aqi: 190, pm25: 131.0, rainProb: 0 },
      { hour: '+4h', temp: 19, aqi: 185, pm25: 124.0, rainProb: 0 },
      { hour: '+5h', temp: 18, aqi: 192, pm25: 135.0, rainProb: 0 },
      { hour: '+6h', temp: 16, aqi: 205, pm25: 154.0, rainProb: 0 },
      { hour: '+7h', temp: 15, aqi: 218, pm25: 168.0, rainProb: 0 }
    ]
  },

  hazardous: {
    id: 'hazardous',
    name: 'Indo-Gangetic Plain / Delhi NCR (Severe Winter Smog Episode)',
    cityName: 'Delhi NCR, India',
    lat: 28.6692,
    lng: 77.4538,
    station: {
      name: 'Ghaziabad Vasundhara Regional CAAQMS (UPPCB / CPCB)',
      provider: 'Uttar Pradesh PCB & Central Pollution Control Board Sameer Network',
      providerUrl: 'https://airquality.cpcb.gov.in/AQI_India/',
      scale: 'US EPA Air Quality Index (AQI)',
      isLiveStation: false,
      isDemo: true,
      stationType: 'Sample / Demo Station Data',
      sourceNotice: 'Sample / Demo Scenario (India) — Simulated test data, not a live measurement',
      lastUpdated: 'Sample Scenario'
    },
    aqi: 348,
    dominantPollutant: 'pm25',
    pollutants: {
      pm25: { value: 298.5, unit: 'µg/m³', aqi: 348 },
      pm10: { value: 412.0, unit: 'µg/m³', aqi: 280 },
      o3: { value: 55.0, unit: 'µg/m³', aqi: 52 },
      no2: { value: 98.0, unit: 'µg/m³', aqi: 95 },
      so2: { value: 34.0, unit: 'µg/m³', aqi: 48 },
      co: { value: 5.8, unit: 'mg/m³', aqi: 62 }
    },
    weather: {
      temperature: 14,
      apparentTemperature: 13,
      humidity: 90,
      windSpeed: 3,
      windDirection: 'WNW',
      precipitation: 0.0,
      condition: 'Severe Stagnant Smog Inversion',
      weatherCode: 45
    },
    hourly: [
      { hour: 'Now', temp: 14, aqi: 348, pm25: 298.5, rainProb: 0 },
      { hour: '+1h', temp: 15, aqi: 360, pm25: 312.0, rainProb: 0 },
      { hour: '+2h', temp: 16, aqi: 375, pm25: 330.0, rainProb: 0 },
      { hour: '+3h', temp: 15, aqi: 355, pm25: 305.0, rainProb: 0 },
      { hour: '+4h', temp: 14, aqi: 340, pm25: 290.0, rainProb: 0 },
      { hour: '+5h', temp: 13, aqi: 330, pm25: 280.0, rainProb: 0 },
      { hour: '+6h', temp: 12, aqi: 320, pm25: 270.0, rainProb: 0 },
      { hour: '+7h', temp: 11, aqi: 310, pm25: 260.0, rainProb: 0 }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEMO_DATA;
}
