// routes/flights.js
const express = require('express');
const router = express.Router();
const { getFlights, getFlightById, bookFlight } = require('../controllers/flightController');
const { protect } = require('../middleware/auth');

// @route   GET /api/flights
// @desc    Get all flights or search
// @access  Public
router.get('/', getFlights);

// @route   GET /api/flights/:id
// @desc    Get single flight
// @access  Public
router.get('/:id', getFlightById);

// @route   POST /api/flights/book
// @desc    Book a flight
// @access  Private
router.post('/book', protect, bookFlight);

module.exports = router;
