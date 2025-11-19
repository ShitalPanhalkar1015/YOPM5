// controllers/hotelController.js
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

/**
 * @desc    Search for available hotels in a city
 * @route   GET /api/hotels
 * @access  Public
 */
const searchHotels = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'Please provide a city.' });
    }

    try {
        const query = {
            city: new RegExp(city, 'i'), // Case-insensitive search
        };

        const hotels = await Hotel.find(query);

        if (hotels.length === 0) {
            return res.json([]); // Return empty array if no hotels found
        }

        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server error while searching for hotels', error: error.message });
    }
};

/**
 * @desc    Book a hotel room
 * @route   POST /api/hotels/book
 * @access  Private
 */
const bookHotel = async (req, res) => {
    const { hotelId, nights } = req.body; // Assuming frontend sends number of nights
    const userId = req.user._id;

    if (!hotelId || !nights) {
        return res.status(400).json({ message: 'Please provide hotelId and number of nights.' });
    }

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }

        // In a real app, you would check room availability for the given dates.
        // For this example, we assume availability.

        // Create a new booking record
        const booking = await Booking.create({
            userId,
            type: 'Hotel',
            itemId: hotelId,
            totalAmount: hotel.pricePerNight * nights,
            details: {
                name: hotel.name,
                city: hotel.city,
                nights: nights,
            },
        });

        res.status(201).json({ message: 'Hotel booked successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server error during hotel booking', error: error.message });
    }
};

module.exports = {
    searchHotels,
    bookHotel,
};
