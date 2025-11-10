// server/server.js

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const cookieParser = require('cookie-parser');

// Load env vars from .env file in the root directory
dotenv.config({ path: '../.env' });

// Initialize express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Body parser middleware to parse JSON bodies
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Error handler middleware (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});