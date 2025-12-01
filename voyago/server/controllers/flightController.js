// controllers/flightController.js
const Flight = require('../models/Flight');

/**
 * @desc    Get all flights or search by from/to/date
 * @route   GET /api/flights
 * @access  Public
 */
const getFlights = async (req, res) => {
    try {
        const { from, to, date } = req.query;
        let query = {};

        if (from) {
            query.from = { $regex: from, $options: 'i' }; // Case-insensitive search
        }
        if (to) {
            query.to = { $regex: to, $options: 'i' };
        }
        if (date) {
            // Match flights on the specific date (ignoring time)
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            
            query.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        const flights = await Flight.find(query).sort({ date: 1, departureTime: 1 });
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching flights', error: error.message });
    }
};

/**
 * @desc    Get single flight by ID
 * @route   GET /api/flights/:id
 * @access  Public
 */
const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json(flight);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching flight', error: error.message });
    }
};

/**
 * @desc    Book a flight
 * @route   POST /api/flights/book
 * @access  Private
 */
const bookFlight = async (req, res) => {
    const { flightId, seats } = req.body;
    const userId = req.user._id;

    if (!flightId || !seats) {
        return res.status(400).json({ message: 'Please provide flightId and number of seats.' });
    }

    try {
        const Booking = require('../models/Booking'); // Import Booking model here or at top
        const flight = await Flight.findById(flightId);

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found.' });
        }

        if (flight.seatsAvailable < seats) {
            return res.status(400).json({ message: 'Not enough seats available.' });
        }

        // Decrease seat count
        flight.seatsAvailable -= seats;
        await flight.save();

        // Create a new booking record
        const booking = await Booking.create({
            userId,
            type: 'Flight',
            itemId: flightId,
            totalAmount: flight.price * seats,
            details: {
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                from: flight.from,
                to: flight.to,
                date: flight.date,
                seatsBooked: seats,
                duration: flight.duration,
            },
        });

        res.status(201).json({ message: 'Flight booked successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server error during flight booking', error: error.message });
    }
};

module.exports = {
    getFlights,
    getFlightById,
    bookFlight,
};
