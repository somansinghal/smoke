// SmogWise Local Server & Grok AI Proxy
// Plain Node.js without heavy framework dependencies

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3456;
const GROK_API_KEY = process.env.GROK_API_KEY || process.env.XAI_API_KEY || '';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3456'}`);
  const pathname = reqUrl.pathname;

  // Add standard CORS & security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Status & Configuration endpoint
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: 'SmogWise Server',
      grokProxyConfigured: Boolean(GROK_API_KEY),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Secure Server-Side Grok Proxy endpoint
  // Only called if user or client tests AI recommendations
  // Personal sensitive health data and exact GPS coordinates are NEVER forwarded
  if (pathname === '/api/grok/recommendations' && req.method === 'POST') {
    if (!GROK_API_KEY) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        enabled: false,
        source: 'local_rule_engine',
        message: 'Grok API key is not configured on the server. SmogWise is running in zero-cost, privacy-first mode using its local explainable rule engine.'
      }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard max body size 64KB
      if (body.length > 65536) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        
        // Sanitize payload: strip any personal identifiers or location coordinates
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
          model: 'grok-2-latest',
          messages: [
            { role: 'system', content: 'You are an environmental health advisor specializing in clean air guidelines.' },
            { role: 'user', content: promptText }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        });

        const grokReq = https.request('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROK_API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: 8000
        }, (grokRes) => {
          let grokData = '';
          grokRes.on('data', chunk => { grokData += chunk; });
          grokRes.on('end', () => {
            if (grokRes.statusCode >= 200 && grokRes.statusCode < 300) {
              try {
                const grokJson = JSON.parse(grokData);
                const reply = grokJson.choices?.[0]?.message?.content;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  enabled: true,
                  source: 'grok_ai',
                  data: JSON.parse(reply)
                }));
              } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  enabled: false,
                  source: 'local_rule_engine',
                  fallback: true,
                  error: 'Failed to parse Grok response'
                }));
              }
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                enabled: false,
                source: 'local_rule_engine',
                fallback: true,
                error: `Grok API error: ${grokRes.statusCode}`
              }));
            }
          });
        });

        grokReq.on('error', (err) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            enabled: false,
            source: 'local_rule_engine',
            fallback: true,
            error: err.message
          }));
        });

        grokReq.write(postData);
        grokReq.end();

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Security check: prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(__dirname, '404.html');
      fs.readFile(notFoundPath, (notErr, notData) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        if (!notErr && notData) {
          res.end(notData);
        } else {
          res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h1>404 - Page Not Found</h1>
            <p>The requested resource was not found on SmogWise.</p>
            <p><a href="/" style="color:#2e7d32;text-decoration:none;font-weight:bold;">Return to SmogWise Home</a></p>
          </body></html>`);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[SmogWise] Server running at http://localhost:${PORT}`);
  console.log(`[SmogWise] Grok Proxy configured: ${Boolean(GROK_API_KEY)} (free explainable rule engine is default active)`);
});
