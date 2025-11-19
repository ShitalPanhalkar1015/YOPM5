// controllers/bookingController.js
const Booking = require('../models/Booking');

/**
 * @desc    Get all bookings for a specific user
 * @route   GET /api/bookings/user/:id
 * @access  Private
 */
const getUserBookings = async (req, res) => {
    // Ensure the logged-in user can only access their own bookings
    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own bookings.' });
    }

    try {
        const bookings = await Booking.find({ userId: req.params.id })
            .populate('itemId') // Populates the 'itemId' with details from the referenced model (Bus, Hotel, or Package)
            .sort({ createdAt: -1 }); // Sort by most recent

        if (!bookings) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching user bookings', error: error.message });
    }
};

module.exports = {
    getUserBookings,
};
