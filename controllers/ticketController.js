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
    const tickets = await Ticket.find({ createdBy: req.user._id});
    res.status(200).json({ success:true, tickets})
};

module.exports = {createTicket, getMyTickets}

