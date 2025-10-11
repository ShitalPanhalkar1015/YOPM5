const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/cabs', require('./routes/cabRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));

// Serve client
app.use(express.static(path.join(__dirname, '..', 'client')));

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_TRIES = 10;

function startServer(port, triesLeft = MAX_TRIES) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} in use.`);
      if (triesLeft > 1) {
        const nextPort = port + 1;
        console.log(`Attempting to listen on port ${nextPort} (${triesLeft - 1} tries left)...`);
        setTimeout(() => startServer(nextPort, triesLeft - 1), 300);
      } else {
        console.error(`All ${MAX_TRIES} ports attempted. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer(DEFAULT_PORT);
