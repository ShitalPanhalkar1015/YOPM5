const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/cabController');

router.get('/', ctrl.listCabs);
router.post('/estimate', ctrl.estimateFare);
router.post('/:id/book', auth, ctrl.bookCab);
router.post('/', auth, admin, ctrl.createCab);
router.put('/:id', auth, admin, ctrl.updateCab);
router.delete('/:id', auth, admin, ctrl.deleteCab);

module.exports = router;
