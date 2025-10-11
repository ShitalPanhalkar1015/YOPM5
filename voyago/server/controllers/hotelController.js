const Hotel = require('../models/Hotel');

const listHotels = async (req, res) => {
  // allow query by city
  const { city } = req.query;
  const q = city ? { city: new RegExp(city, 'i') } : {};
  const hotels = await Hotel.find(q);
  res.json(hotels);
};

const createHotel = async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.json(hotel);
};

const updateHotel = async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(hotel);
};

const deleteHotel = async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

const bookHotel = async (req, res) => {
  const { hotelId, checkIn, checkOut, guests } = req.body;
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  // simple price calc: nights * pricePerNight
  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24)));
  const total = nights * hotel.pricePerNight;
  req.user.bookings.push({ kind: 'hotel', itemId: hotel._id, details: { checkIn, checkOut, guests, nights, total } });
  await req.user.save();
  res.json({ message: 'Hotel booked', booking: req.user.bookings.slice(-1)[0] });
};

module.exports = { listHotels, createHotel, updateHotel, deleteHotel, bookHotel };

/*
GET /api/hotels?city=London
POST /api/hotels/:id/book (auth) { hotelId, checkIn, checkOut, guests }
*/
