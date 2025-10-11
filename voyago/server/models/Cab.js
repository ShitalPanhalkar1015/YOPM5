const mongoose = require('mongoose');

const CabSchema = new mongoose.Schema({
  provider: String,
  baseFare: Number,
  perKm: Number,
  vehicleType: String,
  meta: Object
});

module.exports = mongoose.model('Cab', CabSchema);
