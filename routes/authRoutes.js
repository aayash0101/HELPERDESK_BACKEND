const express = require('express');
const { register, login, logout, getMe } = require('../controllers/authController.js');
const { protect } = require ('../middleware/auth.js')

const router = express.Router();

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);
app.get('/me', getMe)

module.exports = router;
