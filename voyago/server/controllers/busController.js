// controllers/busController.js
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

/**
 * @desc    Search for available buses
 * @route   GET /api/bus
 * @access  Public
 */
const searchBuses = async (req, res) => {
    const { from, to, date } = req.query;

    try {
        let query = {};

        // If search parameters are provided, filter by them
        if (from && to && date) {
            // Create a date range for the entire day
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            query = {
                from: new RegExp(from, 'i'), // Case-insensitive search
                to: new RegExp(to, 'i'),
                date: {
                    $gte: searchDate,
                    $lt: nextDay,
                },
            };
        } else {
            // If no parameters, return all upcoming buses (optional: limit to 20)
            // For now, just return all to populate the page
            query = {
                date: { $gte: new Date() } // Only future buses
            };
        }

        const buses = await Bus.find(query).sort({ date: 1 }); // Sort by date

        if (buses.length === 0) {
            return res.json([]); // Return empty array if no buses found
        }

        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while searching for buses', error: error.message });
    }
};

/**
 * @desc    Book a seat on a bus
 * @route   POST /api/bus/book
 * @access  Private
 */
const bookBus = async (req, res) => {
    const { busId, seats } = req.body; // Assuming frontend sends number of seats
    const userId = req.user._id;

    if (!busId || !seats) {
        return res.status(400).json({ message: 'Please provide busId and number of seats.' });
    }

    try {
        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found.' });
        }

        if (bus.seatsAvailable < seats) {
            return res.status(400).json({ message: 'Not enough seats available.' });
        }

        // Decrease seat count
        bus.seatsAvailable -= seats;
        await bus.save();

        // Create a new booking record
        const booking = await Booking.create({
            userId,
            type: 'Bus',
            itemId: busId,
            totalAmount: bus.price * seats,
            details: {
                name: bus.name,
                from: bus.from,
                to: bus.to,
                date: bus.date,
                seatsBooked: seats,
            },
        });

        res.status(201).json({ message: 'Bus booked successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server error during bus booking', error: error.message });
    }
};


module.exports = {
    searchBuses,
    bookBus,
};
