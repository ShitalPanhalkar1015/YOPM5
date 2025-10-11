const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  rooms: [{ type: String }], // room identifiers or types
  pricePerNight: Number,
  meta: Object
});

module.exports = mongoose.model('Hotel', HotelSchema);
