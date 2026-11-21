// Vercel Serverless Function: /api/status

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'online',
    service: 'SmogWise Server',
    groqProxyConfigured: Boolean(process.env.GROQ_API_KEY),
    timestamp: new Date().toISOString()
  }));
};
