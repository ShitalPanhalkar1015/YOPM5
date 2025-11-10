// server/routes/trips.js

const express = require('express');
const {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes defined below this middleware will be protected
router.use(protect);

// Routes for getting all trips and creating a new trip
router.route('/')
  .get(getAllTrips)
  .post(createTrip);

// Routes for getting, updating, and deleting a single trip
router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;