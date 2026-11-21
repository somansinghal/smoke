// Vercel Serverless Function: /api/groq/recommendations
// Optional Groq AI proxy: zero PII, zero client-side keys

const https = require('https');

module.exports = (req, res) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (!GROQ_API_KEY) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      enabled: false,
      source: 'local_rule_engine',
      message: 'Groq API key is not configured on the server. SmogWise is running in zero-cost, privacy-first mode using its local explainable rule engine.'
    }));
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 65536) req.destroy();
  });

  req.on('end', () => {
    try {
      const payload = JSON.parse(body || '{}');
      const safeContext = {
        aqi: Number(payload.aqi) || 50,
        category: String(payload.category || 'Moderate').slice(0, 40),
        dominantPollutant: String(payload.dominantPollutant || 'pm25').slice(0, 20),
        temperature: Number(payload.temperature) || 20,
        humidity: Number(payload.humidity) || 50,
        windSpeed: Number(payload.windSpeed) || 10,
        weatherCondition: String(payload.weatherCondition || 'Clear').slice(0, 40),
        householdSummary: Array.isArray(payload.householdSummary)
          ? payload.householdSummary.map(s => String(s).slice(0, 40)).slice(0, 5)
          : []
      };

      const promptText = `You are SmogWise AI, an environmental-health assistant.
Given current outdoor conditions:
- AQI: ${safeContext.aqi} (${safeContext.category}, Dominant: ${safeContext.dominantPollutant.toUpperCase()})
- Weather: ${safeContext.temperature}°C, ${safeContext.humidity}% humidity, wind ${safeContext.windSpeed} km/h, ${safeContext.weatherCondition}
- Household profile tags: ${safeContext.householdSummary.join(', ') || 'General adult'}

Provide exactly 4 concise, practical advice cards in JSON format (do not provide medical diagnosis):
1. Outdoor Activity
2. Commute & Travel
3. Home & Cooking Ventilation
4. Indoor Smoke & Air Purifier
Format strictly as JSON with this schema:
{
  "summary": "Brief 1-sentence environmental summary",
  "cards": [
    { "category": "outdoor", "type": "do"|"dont", "title": "short heading", "text": "actionable guidance", "why": "reason based on conditions" },
    { "category": "commute", "type": "do"|"dont", "title": "short heading", "text": "actionable guidance", "why": "reason based on conditions" },
    { "category": "ventilation", "type": "do"|"dont", "title": "short heading", "text": "actionable guidance", "why": "reason based on conditions" },
    { "category": "indoor", "type": "do"|"dont", "title": "short heading", "text": "actionable guidance", "why": "reason based on conditions" }
  ]
}`;

      const postData = JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an environmental health advisor specializing in clean air guidelines. Respond with valid JSON only.' },
          { role: 'user', content: promptText }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const groqReq = https.request({
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      }, (groqRes) => {
        let groqData = '';
        groqRes.on('data', chunk => { groqData += chunk; });
        groqRes.on('end', () => {
          if (groqRes.statusCode >= 200 && groqRes.statusCode < 300) {
            try {
              const groqJson = JSON.parse(groqData);
              const reply = groqJson.choices?.[0]?.message?.content;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                enabled: true,
                source: 'groq_ai',
                data: JSON.parse(reply)
              }));
            } catch (e) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                enabled: false,
                source: 'local_rule_engine',
                fallback: true,
                error: 'Failed to parse Groq response'
              }));
            }
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              enabled: false,
              source: 'local_rule_engine',
              fallback: true,
              error: `Groq API error: ${groqRes.statusCode}`
            }));
          }
        });
      });

      groqReq.on('error', (err) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          enabled: false,
          source: 'local_rule_engine',
          fallback: true,
          error: err.message
        }));
      });

      groqReq.write(postData);
      groqReq.end();

    } catch (err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid JSON request' }));
    }
  });
};
