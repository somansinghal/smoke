// Optional Groq AI Client Integration
// Communicates ONLY with secure server-side proxy
// Zero API keys in client-side code
// Never sends personal health or exact location coordinates to AI

const GROQ_CLIENT = {
  /**
   * Request AI recommendations from server proxy if available
   * Returns null or falls back gracefully to rule engine
   */
  getRecommendations: async function(params) {
    try {
      // Build strictly sanitized, anonymous payload
      // Does NOT include latitude, longitude, city name, or medical details
      const householdLabels = [];
      if (params.household?.children) householdLabels.push('Children in home');
      if (params.household?.seniors) householdLabels.push('Older adults');
      if (params.household?.sensitive) householdLabels.push('Air sensitive');
      if (params.household?.athlete) householdLabels.push('Outdoor athlete');
      if (params.household?.gasCooking) householdLabels.push('Gas cooking');

      const payload = {
        aqi: params.aqi,
        category: params.category,
        dominantPollutant: params.dominantPollutant,
        temperature: params.weather?.temperature,
        humidity: params.weather?.humidity,
        windSpeed: params.weather?.windSpeed,
        weatherCondition: params.weather?.condition,
        householdSummary: householdLabels
      };

      const response = await fetch(CONFIG.API.GROQ_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return { enabled: false, fallback: true };
      }

      const result = await response.json();
      if (result.enabled && result.data && result.data.cards) {
        return {
          enabled: true,
          source: 'groq_ai',
          summary: result.data.summary,
          cards: result.data.cards.map(c => ({
            category: c.category,
            type: c.type,
            title: c.title,
            text: c.text,
            why: c.why,
            priority: c.type === 'dont' ? 'high' : 'normal',
            icon: c.category === 'outdoor' ? '🏃' :
                  c.category === 'commute' ? '🚴' :
                  c.category === 'ventilation' ? '🍳' : '🍃'
          }))
        };
      }

      return { enabled: false, fallback: true, message: result.message };
    } catch (err) {
      // Offline, static host, or proxy not running -> silent fallback
      return { enabled: false, fallback: true };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GROQ_CLIENT;
}
