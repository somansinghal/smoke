// SmogWise Configuration & Constants
const CONFIG = {
  APP_NAME: 'SmogWise',
  TAGLINE: 'Breathe better. Live wiser.',
  
  // Storage Keys
  STORAGE_KEYS: {
    PREFERENCES: 'smogwise_household_preferences',
    CUSTOM_WAQI_TOKEN: 'smogwise_custom_waqi_token',
    LAST_LOCATION: 'smogwise_last_location',
    TEMP_UNIT: 'smogwise_temp_unit' // 'C' or 'F'
  },

  // API Endpoints
  API: {
    GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER: 'https://api.open-meteo.com/v1/forecast',
    AIR_QUALITY_FORECAST: 'https://air-quality-api.open-meteo.com/v1/air-quality',
    WAQI_FEED: 'https://api.waqi.info/feed',
    GROK_PROXY: '/api/grok/recommendations'
  },

  // Default fallback WAQI token (can be overridden by user in settings)
  // WAQI provides public demo access or users can supply their free community token
  DEFAULT_WAQI_TOKEN: 'demo',

  // CPCB Official Portal for India
  CPCB_PORTAL_URL: 'https://airquality.cpcb.gov.in/AQI_India/',
  CPCB_NAME: 'Central Pollution Control Board (CPCB) Sameer Portal',

  // Quick Preset Cities
  POPULAR_CITIES: [
    { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
