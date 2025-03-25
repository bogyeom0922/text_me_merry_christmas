const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  from_name: String,
  to_name: String,
  wish_contents: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Wish || mongoose.model('Wish', wishSchema);