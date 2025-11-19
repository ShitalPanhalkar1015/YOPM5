// routes/bookings.js
const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookings/user/:id
// @desc    Get all bookings for a specific user
// @access  Private (requires token and matching user ID)
router.get('/user/:id', protect, getUserBookings);

module.exports = router;
