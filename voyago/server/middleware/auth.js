// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects routes by verifying the JWT token from the Authorization header.
 * If the token is valid, it attaches the user object to the request.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Bearer TOKEN)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token payload
            // and attach it to the request object (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
