const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
    
    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: {
            _id : user._id,
            name : user.name,
            email: user.email,
            role: user.role,
        },
      });
};

const register = async (req, res) => {
    const {name, email, password, role} = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Email already registered');
    }
    
    const user = await User.create({ name, email, password, role: 'employee' });
    sendTokenResponse(user, 201, res);
}

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide Email and Password');
    };

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        res.status(400);
        throw new Error('Invalid Credentials');
    };

    sendTokenResponse (user, 200, res);
};

const logout = async (req, res) => {
    res.cookie('token' , '' , { maxAge: 1});
    res.json({success: true, message: 'Logged out successfully '});
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
};

module.exports = { register, login, logout, getMe };