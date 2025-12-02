// controllers/hotelController.js
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

/**
 * @desc    Get all hotels or filter by query params
 * @route   GET /api/hotels
 * @access  Public
 */
const getAllHotels = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, rating, featured } = req.query;
        let query = {};

        // Build query based on filters
        if (city) {
            query.city = new RegExp(city, 'i');
        }
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
        }
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }
        if (featured === 'true') {
            query.featured = true;
        }

        const hotels = await Hotel.find(query).sort({ featured: -1, rating: -1 });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching hotels', error: error.message });
    }
};

/**
 * @desc    Search for available hotels in a city
 * @route   GET /api/hotels/search
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
 * @desc    Get a single hotel by ID
 * @route   GET /api/hotels/:id
 * @access  Public
 */
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching hotel', error: error.message });
    }
};

/**
 * @desc    Book a hotel room
 * @route   POST /api/hotels/book
 * @access  Private
 */
const bookHotel = async (req, res) => {
    const { hotelId, nights, checkIn, checkOut } = req.body;
    const userId = req.user._id;

    if (!hotelId || !nights) {
        return res.status(400).json({ message: 'Please provide hotelId and number of nights.' });
    }

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }

        // Check room availability
        if (hotel.roomsAvailable < 1) {
            return res.status(400).json({ message: 'No rooms available.' });
        }

        // Decrease room count
        hotel.roomsAvailable -= 1;
        await hotel.save();

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
                checkIn: checkIn || new Date(),
                checkOut: checkOut || new Date(Date.now() + nights * 24 * 60 * 60 * 1000),
            },
        });

        res.status(201).json({ message: 'Hotel booked successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server error during hotel booking', error: error.message });
    }
};

module.exports = {
    getAllHotels,
    searchHotels,
    getHotelById,
    bookHotel,
};
