// routes/hotels.js
const express = require('express');
const router = express.Router();
const { searchHotels, bookHotel } = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');

// @route   GET /api/hotels
// @desc    Search for available hotels in a city
// @access  Public
router.get('/', searchHotels);

// @route   POST /api/hotels/book
// @desc    Book a hotel room
// @access  Private (requires token)
router.post('/book', protect, bookHotel);

module.exports = router;
