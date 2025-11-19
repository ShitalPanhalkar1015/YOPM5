// config/db.js
const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database using the URI
 * from the environment variables.
 */
const connectDB = async () => {
    try {
        // Set strict query to false to allow for more flexible queries
        mongoose.set('strictQuery', false);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
