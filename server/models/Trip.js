// server/models/Trip.js

const mongoose = require('mongoose');

// Define the Trip schema
const TripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  // Reference to the user who created the trip
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', TripSchema);