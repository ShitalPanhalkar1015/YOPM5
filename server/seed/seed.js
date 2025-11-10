// server/seed/seed.js

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Required for hashing test user password

// Load env vars from the root .env file
dotenv.config({ path: '../../.env' });

// Load models
const User = require('../models/User');
const Trip = require('../models/Trip');

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read the JSON files with sample data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const trips = JSON.parse(
  fs.readFileSync(`${__dirname}/trips.json`, 'utf-8')
);

// Import data into the database from JSON files
const importData = async () => {
  try {
    await User.create(users);
    await Trip.create(trips);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data from the database
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Trip.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Create a specific test user for testing environments
const createTestUser = async () => {
  try {
    // Remove any existing test user to prevent duplicates
    await User.deleteMany({ email: 'test@example.com' });

    // Hash the test user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create the test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
    console.log('Test user created: test@example.com / password123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Determine action based on NODE_ENV or command line arguments
if (process.env.NODE_ENV === 'test') {
  // If in test environment, create a test user
  createTestUser();
} else if (process.argv[2] === '-i') {
  // If '-i' argument is provided, import data from JSON files
  importData();
} else if (process.argv[2] === '-d') {
  // If '-d' argument is provided, delete all data
  deleteData();
}
