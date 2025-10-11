const Package = require('../models/Package');

const listPackages = async (req, res) => {
  const packages = await Package.find({});
  res.json(packages);
};

const getPackage = async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Not found' });
  res.json(pkg);
};

const createPackage = async (req, res) => {
  const pkg = await Package.create(req.body);
  res.json(pkg);
};

const updatePackage = async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(pkg);
};

const deletePackage = async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

const bookPackage = async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  req.user.bookings.push({ kind: 'package', itemId: pkg._id, details: { price: pkg.price } });
  await req.user.save();
  res.json({ message: 'Package booked', booking: req.user.bookings.slice(-1)[0] });
};

module.exports = { listPackages, getPackage, createPackage, updatePackage, deletePackage, bookPackage };

/*
GET /api/packages
POST /api/packages/:id/book (auth)
*/
