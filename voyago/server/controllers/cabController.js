const Cab = require('../models/Cab');

const listCabs = async (req, res) => {
  const cabs = await Cab.find({});
  res.json(cabs);
};

const createCab = async (req, res) => {
  const cab = await Cab.create(req.body);
  res.json(cab);
};

const updateCab = async (req, res) => {
  const cab = await Cab.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cab);
};

const deleteCab = async (req, res) => {
  await Cab.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// estimate: body { distanceKm: 12, cabId: '...' }
const estimateFare = async (req, res) => {
  const { distanceKm, cabId } = req.body;
  const cab = await Cab.findById(cabId);
  if (!cab) return res.status(404).json({ message: 'Cab not found' });
  const fare = cab.baseFare + (cab.perKm * distanceKm);
  res.json({ distanceKm, fare });
};

const bookCab = async (req, res) => {
  // simple booking: store origin/destination and fare in user bookings
  const { cabId, origin, destination, distanceKm } = req.body;
  const cab = await Cab.findById(cabId);
  if (!cab) return res.status(404).json({ message: 'Cab not found' });
  const fare = cab.baseFare + cab.perKm * (distanceKm || 0);
  req.user.bookings.push({ kind: 'cab', itemId: cab._id, details: { origin, destination, distanceKm, fare } });
  await req.user.save();
  res.json({ message: 'Cab booked', booking: req.user.bookings.slice(-1)[0] });
};

module.exports = { listCabs, createCab, updateCab, deleteCab, estimateFare, bookCab };

/*
POST /api/cabs/estimate  { cabId, distanceKm }
POST /api/cabs/:id/book  (auth) { origin,destination,distanceKm }
*/
