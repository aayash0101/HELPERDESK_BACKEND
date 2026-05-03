const express = require('express');
const {createTicket, getMyTickets, getTicketById, addComment, getAllTickets, updateTicket} = require('../controllers/ticketController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/admin/all', protect, adminOnly, getAllTickets);  // ← move up
router.patch('/admin/:id', protect, adminOnly, updateTicket);
router.get('/my', protect, getMyTickets);
router.get('/:id', protect, getTicketById);
router.post('/:id/comments', protect, addComment);

module.exports = router;
