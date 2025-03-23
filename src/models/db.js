const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas 연결 성공');
    } catch (error) {
        console.error('❌ MongoDB Atlas 연결 실패:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
