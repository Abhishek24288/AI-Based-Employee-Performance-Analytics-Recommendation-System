const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'guruji_ai_secret_key_12345';
      const decoded = jwt.verify(token, secret);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found.' });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token verification failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided.' });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
