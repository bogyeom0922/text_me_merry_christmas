const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },   // = id
    nickname: String,
    profileImage: String,
    password: String, // 'kakao' 라고 표시만 해도 OK
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', userSchema);
