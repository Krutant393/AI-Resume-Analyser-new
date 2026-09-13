const express = require('express');
const app = express();
const router = require('./routes/loginRoutes');
const userModel = require('./models/userModel');
const authController = require('./controllers/authController');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

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




const path = require('path');
const fs = require('fs');

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', router);

// Serve frontend static build if present (e.g., full-stack deployment)
const frontendDist = path.join(__dirname, '../ai-resume-analyser/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.use((req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'AI Resume Analyser API is running'
        });
    });
}

module.exports = app;