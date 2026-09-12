const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const registerController = async(req, res) => {

    const { fullname, email, password } = req.body;

    try {

        const data = await userModel.findOne({ email: email });

        if (data) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            fullname,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );

        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

        res.status(200).json({
            message: 'User created successfully'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error creating user'
        });
    }
};


const loginController = async(req, res) => {

    const { email, password } = req.body;

    try {

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const comparePassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!comparePassword) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }



        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );




        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

        res.status(200).json({
            message: 'Login successful',
            user: {
                fullname: user.fullname,
                email: user.email
            }
        });




    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: 'Error logging in'
        });
    }
};


module.exports = {
    registerController,
    loginController
};
