// utils/seed.js
const Bus = require('../models/Bus');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

const buses = [
    { name: 'VRL Travels', from: 'Mumbai', to: 'Delhi', date: new Date('2025-12-15'), departureTime: '08:00 AM', arrivalTime: '10:00 PM', price: 2500, seatsAvailable: 30 },
    { name: 'Sharma Transports', from: 'Bangalore', to: 'Hyderabad', date: new Date('2025-12-16'), departureTime: '10:00 PM', arrivalTime: '06:00 AM', price: 1200, seatsAvailable: 25 },
    { name: 'Red Bus', from: 'Chennai', to: 'Madurai', date: new Date('2025-12-17'), departureTime: '09:30 PM', arrivalTime: '05:00 AM', price: 800, seatsAvailable: 40 },
    { name: 'Orange Travels', from: 'Pune', to: 'Goa', date: new Date('2025-12-18'), departureTime: '07:00 AM', arrivalTime: '05:00 PM', price: 1500, seatsAvailable: 35 },
    { name: 'SRS Travels', from: 'Delhi', to: 'Jaipur', date: new Date('2025-12-19'), departureTime: '06:00 AM', arrivalTime: '11:00 AM', price: 900, seatsAvailable: 28 },
    { name: 'Parveen Travels', from: 'Hyderabad', to: 'Bangalore', date: new Date('2025-12-20'), departureTime: '11:00 PM', arrivalTime: '07:00 AM', price: 1100, seatsAvailable: 32 },
];

const hotels = [
    { 
        name: 'Taj Palace', 
        city: 'Mumbai', 
        address: 'Apollo Bunder, Colaba, Mumbai',
        description: 'Experience luxury at its finest with stunning views of the Arabian Sea',
        pricePerNight: 15000, 
        rating: 5, 
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service'],
        roomsAvailable: 15,
        featured: true
    },
    { 
        name: 'The Leela', 
        city: 'Goa', 
        address: 'Mobor Beach, Cavelossim, Goa',
        description: 'A beachfront paradise with world-class amenities and service',
        pricePerNight: 12000, 
        rating: 5, 
        image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar'],
        roomsAvailable: 20,
        featured: true
    },
    { 
        name: 'Hyatt Regency', 
        city: 'Delhi', 
        address: 'Bhikaji Cama Place, New Delhi',
        description: 'Modern comfort in the heart of the capital city',
        pricePerNight: 8000, 
        rating: 4, 
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Business Center'],
        roomsAvailable: 25,
        featured: false
    },
    { 
        name: 'ITC Grand Chola', 
        city: 'Chennai', 
        address: 'Mount Road, Guindy, Chennai',
        description: 'Palatial luxury inspired by the Chola dynasty',
        pricePerNight: 10000, 
        rating: 5, 
        image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Gym', 'Concierge'],
        roomsAvailable: 18,
        featured: true
    },
    { 
        name: 'Oberoi Udaivilas', 
        city: 'Udaipur', 
        address: 'Haridasji Ki Magri, Udaipur',
        description: 'Royal heritage hotel overlooking Lake Pichola',
        pricePerNight: 25000, 
        rating: 5, 
        image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Lake View', 'Pool', 'Spa', 'Fine Dining', 'Butler Service'],
        roomsAvailable: 8,
        featured: true
    },
    { 
        name: 'Trident Hotel', 
        city: 'Jaipur', 
        address: 'Amber Fort Road, Jaipur',
        description: 'Contemporary elegance near the historic Amber Fort',
        pricePerNight: 7000, 
        rating: 4, 
        image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Garden'],
        roomsAvailable: 22,
        featured: false
    },
];

const packages = [
    { 
        destination: 'Kerala Backwaters', 
        description: 'A serene trip through the backwaters of Alleppey with houseboat stays and traditional Kerala cuisine',
        price: 25000, 
        image: 'https://tse3.mm.bing.net/th/id/OIP.VEsQqc9x09LVd1b__c144AHaEs?rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: '5 Days / 4 Nights',
        featured: true,
        rating: 4.8,
        activities: ['Houseboat Cruise', 'Ayurvedic Spa', 'Village Walk', 'Canoeing']
    },
    { 
        destination: 'Rajasthan Desert Tour', 
        description: 'Explore the majestic forts, palaces, and golden deserts of Rajasthan with camel safaris',
        price: 30000, 
        image: 'https://tse2.mm.bing.net/th/id/OIP.GzHkjlimuCgMGy0qAsP4BwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: '7 Days / 6 Nights',
        featured: true,
        rating: 4.7,
        activities: ['Camel Safari', 'Fort Visits', 'Folk Dance', 'Desert Camping']
    },
    { 
        destination: 'Himalayan Adventure', 
        description: 'Trekking, adventure sports, and breathtaking mountain views in the mighty Himalayas',
        price: 40000, 
        image: 'https://tse2.mm.bing.net/th/id/OIP.bmnzQkI-sH5T3rRw6B1qdwHaEo?rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: '10 Days / 9 Nights',
        featured: true,
        rating: 4.9,
        activities: ['Trekking', 'River Rafting', 'Camping', 'Paragliding']
    },
    { 
        destination: 'Goa Beach Paradise', 
        description: 'Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife',
        price: 18000, 
        image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
        duration: '4 Days / 3 Nights',
        featured: false,
        rating: 4.5,
        activities: ['Beach Hopping', 'Water Sports', 'Nightlife', 'Spice Plantation Tour']
    },
    { 
        destination: 'Golden Triangle Tour', 
        description: 'Discover Delhi, Agra, and Jaipur - India\'s most iconic historical destinations',
        price: 22000, 
        image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
        duration: '6 Days / 5 Nights',
        featured: true,
        rating: 4.6,
        activities: ['Taj Mahal Visit', 'City Tours', 'Shopping', 'Cultural Shows']
    },
    { 
        destination: 'Andaman Islands Escape', 
        description: 'Tropical paradise with crystal clear waters, coral reefs, and pristine beaches',
        price: 35000, 
        image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
        duration: '7 Days / 6 Nights',
        featured: true,
        rating: 4.9,
        activities: ['Scuba Diving', 'Snorkeling', 'Beach Relaxation', 'Island Hopping']
    },
];

const seedDatabase = async () => {
    try {
        // Clear existing data to ensure updates are applied
        await Bus.deleteMany({});
        await Hotel.deleteMany({});
        await Package.deleteMany({});
        
        console.log('Cleared existing data.');

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
    const path = require('path');
    // Correct path: utils -> server -> voyago -> YOPM5
    const envPath = path.resolve(__dirname, '../../../.env');
    console.log('Loading .env from:', envPath);
    require('dotenv').config({ path: envPath });
    
    // If that didn't work (e.g. MONGO_URI is undefined), try default
    if (!process.env.MONGO_URI) {
         console.log('MONGO_URI not found, trying default .env');
         require('dotenv').config();
    }

    console.log('MONGO_URI is:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

    const connectDB = require('../config/db');
    connectDB().then(() => {
        seedDatabase().then(() => process.exit());
    });
}


module.exports = { seedDatabase };
