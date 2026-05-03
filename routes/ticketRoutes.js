const express = require('express');
const {createTicket, getMyTickets} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);

module.exports = router;
