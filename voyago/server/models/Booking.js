// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Type of booking: 'Bus', 'Hotel', or 'Package'
    type: {
        type: String,
        required: true,
        enum: ['Bus', 'Hotel', 'Package'],
    },
    // Reference to the specific item that was booked
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Dynamically reference the correct model based on the 'type' field
        refPath: 'type',
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        default: 'Confirmed',
    },
    // Store a snapshot of key details at the time of booking
    details: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
