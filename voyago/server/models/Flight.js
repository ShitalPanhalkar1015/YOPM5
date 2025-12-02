// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: {
        type: String,
        required: true,
    },
    flightNumber: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    departureTime: {
        type: String, // e.g., "10:00 AM"
        required: true,
    },
    arrivalTime: {
        type: String, // e.g., "02:00 PM"
        required: true,
    },
    duration: {
        type: String, // e.g., "4h 00m"
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seatsAvailable: {
        type: Number,
        required: true,
        default: 150,
    },
}, {
    timestamps: true,
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
