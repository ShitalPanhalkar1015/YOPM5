const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  kind: { type: String, required: true }, // 'bus'|'cab'|'hotel'|'package'
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'bookings.kind' },
  details: { type: Object }, // seat numbers, dates, fare etc.
  bookedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  bookings: [BookingSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
