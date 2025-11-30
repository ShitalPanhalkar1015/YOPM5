// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    image: {
        type: String,
        required: false,
    },
    amenities: {
        type: [String],
        default: [],
    },
    roomsAvailable: {
        type: Number,
        default: 10,
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
