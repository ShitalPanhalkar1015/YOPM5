const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  name: String,
  from: String,
  to: String,
  date: Date,
  price: Number,
  seatsTotal: Number,
  seatsAvailable: [Number], // list of available seat numbers
  meta: Object
});

module.exports = mongoose.model('Bus', BusSchema);
