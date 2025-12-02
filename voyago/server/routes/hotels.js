// routes/hotels.js
const express = require('express');
const router = express.Router();
const { getAllHotels, searchHotels, getHotelById, bookHotel } = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');

// @route   GET /api/hotels
// @desc    Get all hotels or filter by query params
// @access  Public
router.get('/', getAllHotels);

// @route   GET /api/hotels/search
// @desc    Search for available hotels in a city
// @access  Public
router.get('/search', searchHotels);

// @route   GET /api/hotels/:id
// @desc    Get a single hotel by ID
// @access  Public
router.get('/:id', getHotelById);

// @route   POST /api/hotels/book
// @desc    Book a hotel room
// @access  Private (requires token)
router.post('/book', protect, bookHotel);

module.exports = router;
