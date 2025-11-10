// server/utils/token.js

const jwt = require('jsonwebtoken');

/**
 * @desc    Create a JWT token
 * @param   {string} id The user ID to include in the token payload
 * @returns {string} The generated JWT token
 */
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = {
  createToken,
};