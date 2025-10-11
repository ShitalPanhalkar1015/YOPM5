const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/packageController');

router.get('/', ctrl.listPackages);
router.get('/:id', ctrl.getPackage);
router.post('/:id/book', auth, ctrl.bookPackage);
router.post('/', auth, admin, ctrl.createPackage);
router.put('/:id', auth, admin, ctrl.updatePackage);
router.delete('/:id', auth, admin, ctrl.deletePackage);

module.exports = router;
