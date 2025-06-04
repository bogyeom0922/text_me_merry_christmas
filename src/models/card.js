const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    from_name: { type: String, required: true },
    to_name: { type: String, required: true },
    content: { type: String, required: true },
    card_type: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    confirmed: {
      type: Boolean,
      default: false
    }
});

module.exports = mongoose.model('card', cardSchema);
