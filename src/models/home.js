const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    message: String,
    sender: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('home', homeSchema);
