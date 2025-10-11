const Bus = require('../models/Bus');
const User = require('../models/User');

const listBuses = async (req, res) => {
  const buses = await Bus.find({});
  res.json(buses);
};

const getBus = async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json(bus);
};

const createBus = async (req, res) => {
  const payload = req.body;
  const bus = await Bus.create(payload);
  res.json(bus);
};

const updateBus = async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bus);
};

const deleteBus = async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// booking: select seat numbers array in body { seats: [1,2] }
const bookBus = async (req, res) => {
  const { seats } = req.body;
  const bus = await Bus.findById(req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  // simple seat availability check
  const available = seats.every(s => bus.seatsAvailable.includes(s));
  if (!available) return res.status(400).json({ message: 'One or more seats unavailable' });
  // remove seats
  bus.seatsAvailable = bus.seatsAvailable.filter(s => !seats.includes(s));
  await bus.save();
  // add booking to user
  req.user.bookings.push({ kind: 'bus', itemId: bus._id, details: { seats, price: bus.price } });
  await req.user.save();
  res.json({ message: 'Booked', booking: req.user.bookings.slice(-1)[0] });
};

module.exports = { listBuses, getBus, createBus, updateBus, deleteBus, bookBus };

/*
GET /api/buses
GET /api/buses/:id
POST /api/buses  (admin) { name, from, to, date, price, seatsTotal, seatsAvailable: [1,2,3] }
POST /api/buses/:id/book  (auth) { seats: [1,2] }
*/
