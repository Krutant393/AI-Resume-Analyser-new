const mongoose = require('mongoose');
const userModel = require('./userModel');
const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resume: {
        type: String,
        required: true
    },
    analysis: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Analysis', analysisSchema);