// controllers/packageController.js
const Package = require('../models/Package');
const Booking = require('../models/Booking');

/**
 * @desc    Get all travel packages with optional filtering
 * @route   GET /api/packages
 * @access  Public
 */
const getPackages = async (req, res) => {
    try {
        const { destination, minPrice, maxPrice, featured } = req.query;
        let query = {};

        if (destination) {
            query.destination = { $regex: destination, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (featured) {
            query.featured = featured === 'true';
        }

        const packages = await Package.find(query).sort({ featured: -1, price: 1 });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching packages', error: error.message });
    }
};

/**
 * @desc    Get a single package by ID
 * @route   GET /api/packages/:id
 * @access  Public
 */
const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(pkg);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching package details', error: error.message });
    }
};

/**
 * @desc    Book a travel package
 * @route   POST /api/packages/book
 * @access  Private
 */
const bookPackage = async (req, res) => {
    const { packageId } = req.body;
    const userId = req.user._id;

    if (!packageId) {
        return res.status(400).json({ message: 'Please provide a packageId.' });
    }

    try {
        const travelPackage = await Package.findById(packageId);

        if (!travelPackage) {
            return res.status(404).json({ message: 'Package not found.' });
        }

        // Create a new booking record
        const booking = await Booking.create({
            userId,
            type: 'Package',
            itemId: packageId,
            totalAmount: travelPackage.price,
            details: {
                destination: travelPackage.destination,
                duration: travelPackage.duration,
            },
        });

        res.status(201).json({ message: 'Package booked successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server error during package booking', error: error.message });
    }
};

module.exports = {
    getPackages,
    getPackageById,
    bookPackage,
};
