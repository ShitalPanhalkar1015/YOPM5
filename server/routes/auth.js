// server/routes/auth.js

const express = require('express');
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

// Route for user registration with validation
// POST /api/auth/register
router.post(
  '/register',
  [
    // Validation rules
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  register
);

// Route for user login
// POST /api/auth/login
router.post('/login', login);

module.exports = router;
