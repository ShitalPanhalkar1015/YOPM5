// routes/packages.js
const express = require('express');
const router = express.Router();
const { getPackages, bookPackage } = require('../controllers/packageController');
const { protect } = require('../middleware/auth');

// @route   GET /api/packages
// @desc    Get all travel packages
// @access  Public
router.get('/', getPackages);

// @route   GET /api/packages/:id
// @desc    Get a single package by ID
// @access  Public
router.get('/:id', require('../controllers/packageController').getPackageById);

// @route   POST /api/packages/book
// @desc    Book a travel package
// @access  Private (requires token)
router.post('/book', protect, bookPackage);

module.exports = router;
