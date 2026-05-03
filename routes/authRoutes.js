const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController.js');
const { protect } = require ('../middleware/auth.js')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe)

module.exports = router;
