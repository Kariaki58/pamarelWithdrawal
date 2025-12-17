/**
 * Authentication middleware
 * Validates API key from request headers
 */
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      status: 'error',
      message: 'API key is required. Please provide it in the X-API-Key header or Authorization header.'
    });
  }

  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    // If no API_KEY is set in env, allow all requests (for development)
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        status: 'error',
        message: 'Server configuration error: API_KEY not set'
      });
    }
    return next();
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid API key'
    });
  }

  next();
};

module.exports = { authenticate };

