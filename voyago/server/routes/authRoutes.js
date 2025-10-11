const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, (req, res) => {
  // returns current user (without password)
  res.json(req.user);
});

module.exports = router;
