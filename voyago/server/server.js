// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedDatabase } = require('./utils/seed');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// Seed the database with initial data if it's empty
seedDatabase();

// Define API Routes
app.get('/', (req, res) => {
    res.send('Voyago API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bus', require('./routes/bus'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
