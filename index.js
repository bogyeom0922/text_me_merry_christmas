const app = require('./app');
const connectDB = require('./src/models/db'); // MongoDB 연결 함수 import

const PORT = 8080;	

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ MongoDB 연결 성공`);
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB 연결 실패:', err);
        process.exit(1); // 연결 실패 시 서버 실행 중단
    });
