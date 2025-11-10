// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncWrapper = require('./asyncWrapper');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes that require authentication
 */
const protect = asyncWrapper(async (req, res, next) => {
  let token;

  // Prioritize getting the token from the HttpOnly cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to the Authorization header for other clients
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from the 'Bearer <token>' format
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
});

module.exports = { protect };