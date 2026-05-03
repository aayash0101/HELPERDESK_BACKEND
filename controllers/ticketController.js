const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
        title,
        description,
        category,
        priority,
        createdBy: req.user._id
    });
    res.status(201).json({ success: true, ticket });
};

const getMyTickets = async (req, res) => {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, tickets })
};

const getTicketById = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
       return res.status(404).json({ success: false, message: "No tickets found" });
    }
    if (ticket.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this ticket');
    }
    res.status(200).json({ success: true, ticket });
}

module.exports = { createTicket, getMyTickets, getTicketById };

