const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/hotelController');

router.get('/', ctrl.listHotels);
router.post('/:id/book', auth, ctrl.bookHotel);
router.post('/', auth, admin, ctrl.createHotel);
router.put('/:id', auth, admin, ctrl.updateHotel);
router.delete('/:id', auth, admin, ctrl.deleteHotel);

module.exports = router;
