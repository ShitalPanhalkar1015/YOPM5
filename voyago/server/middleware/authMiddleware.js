const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Invalid token user' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token error', error: err.message });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ message: 'Admin only' });
};

module.exports = { auth, admin };
