const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('Not authorized — no token');
    }
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        res.status(401);
        throw new Error('User no longer exists');
    }

    next();
};
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied — admins only');
    }
    next();
};

module.exports = { protect, adminOnly };