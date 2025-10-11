const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Cab = require('./models/Cab');
const Hotel = require('./models/Hotel');
const Package = require('./models/Package');

(async () => {
  try {
    await connectDB();
    // clear collections
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Cab.deleteMany({});
    await Hotel.deleteMany({});
    await Package.deleteMany({});

    const adminPass = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@voyago.com', password: adminPass, isAdmin: true });

    await Bus.create({
      name: 'Express Line',
      from: 'City A',
      to: 'City B',
      date: new Date(),
      price: 25,
      seatsTotal: 40,
      seatsAvailable: Array.from({ length: 40 }, (_, i) => i + 1)
    });

    await Cab.create({ provider: 'QuickCabs', baseFare: 3, perKm: 1.2, vehicleType: 'Sedan' });
    await Hotel.create({ name: 'Grand Hotel', city: 'City B', rooms: ['101','102','103'], pricePerNight: 50 });
    await Package.create({ title: 'Weekend in City B', destination: 'City B', startDate: new Date(), endDate: new Date(Date.now()+2*86400000), price: 199, details: '2 nights stay + city tour' });

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
