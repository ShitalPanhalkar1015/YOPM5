const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/busController');

router.get('/', ctrl.listBuses);
router.get('/:id', ctrl.getBus);
router.post('/:id/book', auth, ctrl.bookBus); // auth required
router.post('/', auth, admin, ctrl.createBus); // admin
router.put('/:id', auth, admin, ctrl.updateBus);
router.delete('/:id', auth, admin, ctrl.deleteBus);

module.exports = router;
