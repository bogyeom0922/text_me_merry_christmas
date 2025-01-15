// 애플리케이션 초기 설정
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// 기본 미들웨어
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

// 라우터 설정
app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/card', cardRouter);

// 오류 처리 미들웨어
app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});