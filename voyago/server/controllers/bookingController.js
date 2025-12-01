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

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure the logged-in user owns the booking
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error while cancelling booking', error: error.message });
    }
};

module.exports = {
    getUserBookings,
    cancelBooking,
};
