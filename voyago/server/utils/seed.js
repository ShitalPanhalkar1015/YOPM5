// utils/seed.js
const Bus = require('../models/Bus');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

const buses = [
    { name: 'VRL Travels', from: 'Mumbai', to: 'Delhi', date: new Date('2024-10-25'), departureTime: '08:00 AM', arrivalTime: '10:00 PM', price: 2500, seatsAvailable: 30 },
    { name: 'Sharma Transports', from: 'Bangalore', to: 'Hyderabad', date: new Date('2024-10-26'), departureTime: '10:00 PM', arrivalTime: '06:00 AM', price: 1200, seatsAvailable: 25 },
    { name: 'Red Bus', from: 'Chennai', to: 'Madurai', date: new Date('2024-10-27'), departureTime: '09:30 PM', arrivalTime: '05:00 AM', price: 800, seatsAvailable: 40 },
];

const hotels = [
    { name: 'Taj Palace', city: 'Mumbai', pricePerNight: 15000, rating: 5, image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'The Leela', city: 'Goa', pricePerNight: 12000, rating: 5, image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Hyatt Regency', city: 'Delhi', pricePerNight: 8000, rating: 4, image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const packages = [
    { destination: 'Kerala Backwaters', description: 'A serene trip through the backwaters of Alleppey.', price: 25000, image: 'https://images.pexels.com/photos/1586795/pexels-photo-1586795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', duration: '5 Days / 4 Nights' },
    { destination: 'Rajasthan Desert Tour', description: 'Explore the majestic forts and deserts of Rajasthan.', price: 30000, image: 'https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', duration: '7 Days / 6 Nights' },
    { destination: 'Himalayan Adventure', description: 'Trekking and adventure sports in the Himalayas.', price: 40000, image: 'https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', duration: '10 Days / 9 Nights' },
];

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Bus.deleteMany({});
        await Hotel.deleteMany({});
        await Package.deleteMany({});

        // Insert new data
        await Bus.insertMany(buses);
        await Hotel.insertMany(hotels);
        await Package.insertMany(packages);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// This allows running the seed script directly, e.g., `node utils/seed.js`
// but we will call it from server.js for simplicity.
if (require.main === module) {
    require('dotenv').config({ path: '../.env' });
    const connectDB = require('../config/db');
    connectDB().then(() => {
        seedDatabase().then(() => process.exit());
    });
}


module.exports = { seedDatabase };
