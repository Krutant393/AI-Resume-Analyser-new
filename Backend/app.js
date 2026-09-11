const express = require('express');
const app = express();
const router = require('./routes/loginRoutes');
const userModel = require('./models/userModel');
const authController = require('./controllers/authController');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.use('/api/auth', router);



module.exports = app;