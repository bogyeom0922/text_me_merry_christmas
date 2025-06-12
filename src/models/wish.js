const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
	nickname: String,
	wish_contents: String,
	deco_type: String,
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Wish || mongoose.model('Wish', wishSchema);