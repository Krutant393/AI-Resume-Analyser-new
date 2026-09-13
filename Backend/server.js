const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./db/db');

connectDB();

const port = process.env.PORT || process.env.port || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.warn('Unhandled Rejection detected (server continuing):', reason?.message || reason);
});