const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const registerController = async(req, res) => {
    const fullname = req.body.fullname || req.body.name;
    const { email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({
            message: 'All fields (name, email, password) are required'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const data = await userModel.findOne({ email: normalizedEmail });

        if (data) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hash = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            fullname: fullname.trim(),
            email: normalizedEmail,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: 'Error creating user'
        });
    }
};


const loginController = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const comparePassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!comparePassword) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: 'Error logging in'
        });
    }
};

const logoutController = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
    });
    return res.status(200).json({
        message: 'Logged out successfully'
    });
};

module.exports = {
    registerController,
    loginController,
    logoutController
};
