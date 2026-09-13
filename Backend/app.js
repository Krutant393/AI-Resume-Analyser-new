const express = require('express');
const app = express();
const router = require('./routes/loginRoutes');
const userModel = require('./models/userModel');
const authController = require('./controllers/authController');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (
            origin.startsWith('http://localhost') ||
            origin.startsWith('http://127.0.0.1')
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.use('/api/auth', router);



module.exports = app;