// models/Bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    name: {
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
        type: String, // e.g., "08:00 PM"
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seatsAvailable: {
        type: Number,
        required: true,
        default: 40,
    },
}, {
    timestamps: true,
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
