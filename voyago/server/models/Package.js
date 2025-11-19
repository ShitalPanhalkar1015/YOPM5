// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false, // Optional image URL
    },
    duration: { // e.g., "5 Days / 4 Nights"
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
