const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  price: Number,
  details: String
});

module.exports = mongoose.model('Package', PackageSchema);
