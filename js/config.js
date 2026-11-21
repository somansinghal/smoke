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

  // Quick Preset Cities (India Locations Only)
  POPULAR_CITIES: [
    { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { name: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
    { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
    { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
