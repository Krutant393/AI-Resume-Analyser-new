const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000, // Closes idle connections before Atlas/router sends TCP RST (ECONNRESET)
            retryWrites: true,
            retryReads: true
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB initial connection error:", err.message);
    }
};

// Listeners to gracefully handle background network resets without crashing
mongoose.connection.on('error', (err) => {
    console.warn("MongoDB connection warning (pool auto-recovering):", err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn("MongoDB disconnected. Connection pool reconnecting...");
});

module.exports = connectDB;