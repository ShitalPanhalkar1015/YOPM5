// routes/bus.js
const express = require('express');
const router = express.Router();
const { searchBuses, bookBus } = require('../controllers/busController');
const { protect } = require('../middleware/auth');

// @route   GET /api/bus
// @desc    Search for available buses
// @access  Public
router.get('/', searchBuses);

// @route   POST /api/bus/book
// @desc    Book a seat on a bus
// @access  Private (requires token)
router.post('/book', protect, bookBus);

module.exports = router;
