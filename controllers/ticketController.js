const Ticket = require('../models/Ticket');
const sendEmail = require('../utils/email');

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
    if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this ticket');
    }
    res.status(200).json({ success: true, ticket });
};

const getStats = async(req, res) => {
    const totalTickets = await Ticket.countDocuments();

    const byStatus = await Ticket.aggregate([
        { $group: {_id: '$status', count: { $sum: 1 }}}
    ]);
    const byPriority = await Ticket.aggregate([
        { $group: {_id: '$priority', count: { $sum: 1 }}}
    ]);
    const byCategory = await Ticket.aggregate([
        { $group: {_id: '$category', count: { $sum: 1 }}}
    ]);
 
    res.status(200).json({
        success:true, 
        stats: {
            byStatus,
            byPriority,
            byCategory
        }
    });
};

const addComment = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name email');
    if (!ticket) {
        return res.status(404).json({ success: false, message: "No tickets found" });
    }
    if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this ticket');
    }
    ticket.comments.push({ message: req.body.message, user: req.user._id });
    await ticket.save();
    await sendEmail({
        to: ticket.createdBy.email,
        subject: 'New comment on your ticket',
        html: `<p>Hi ${ticket.createdBy.name},</p>
           <p>A new comment was added to your ticket <strong>${ticket.title}</strong>.</p>`
    });
    res.json({ success: true, ticket }
    )

};

const getAllTickets = async (req, res) => {
    const tickets = await Ticket.find({})
    res.status(200).json({ success: true, tickets });
};

const updateTicket = async (req, res) => {

    const { status, priority, assignedTo } = req.body
    const ticket = await Ticket.findByIdAndUpdate(req.params.id,
        { status, priority, assignedTo },
        { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!ticket) {
        return res.status(404).json({ success: false, message: 'No tickets found' });
    }
    await sendEmail({
        to: ticket.createdBy.email,
        subject: 'Your ticket has been updated',
        html: `<p>Hi ${ticket.createdBy.name},</p>
           <p>Your ticket <strong>${ticket.title}</strong> status has been changed to <strong>${ticket.status}</strong>.</p>`
    })
    res.status(200).json({ success: true, ticket })
};

module.exports = { createTicket, getMyTickets, getTicketById, addComment, getAllTickets, updateTicket };

