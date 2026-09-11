const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const {
    registerController
} = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
router.post('/register', registerController);

router.post('/login', loginController);



module.exports = router;