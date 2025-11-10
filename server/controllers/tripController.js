// server/controllers/tripController.js

const Trip = require('../models/Trip');
const asyncWrapper = require('../middleware/asyncWrapper');

/**
 * @desc    Get all trips for the logged-in user
 * @route   GET /api/trips
 * @access  Private
 */
const getAllTrips = asyncWrapper(async (req, res, next) => {
  // Find all trips associated with the logged-in user
  const trips = await Trip.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips,
  });
});

/**
 * @desc    Get a single trip by its ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
const getTrip = asyncWrapper(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  // Make sure the logged-in user is the owner of the trip
  if (trip.user.toString() !== req.user.id) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this trip' });
  }

  res.status(200).json({
    success: true,
    data: trip,
  });
});

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 * @access  Private
 */
const createTrip = asyncWrapper(async (req, res, next) => {
  // Add the logged-in user's ID to the request body
  req.body.user = req.user.id;
  const trip = await Trip.create(req.body);
  res.status(201).json({
    success: true,
    data: trip,
  });
});

/**
 * @desc    Update a trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
const updateTrip = asyncWrapper(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  // Make sure the logged-in user is the owner of the trip
  if (trip.user.toString() !== req.user.id) {
    return res.status(401).json({ success: false, error: 'Not authorized to update this trip' });
  }

  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: trip,
  });
});

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
const deleteTrip = asyncWrapper(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  // Make sure the logged-in user is the owner of the trip
  if (trip.user.toString() !== req.user.id) {
    return res.status(401).json({ success: false, error: 'Not authorized to delete this trip' });
  }

  await trip.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
};