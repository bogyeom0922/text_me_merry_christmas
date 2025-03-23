const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const homeRouter = require('./src/routes/homeRouter');
const userRouter = require('./src/routes/userRouter');
const cardRouter = require('./src/routes/cardRouter');

const authRouter = require('./src/routes/authRouter');
const { errorHandler } = require('./src/middlewares/errorHandler');

const app = express();

const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET, // .env로 뺄 수도 있음
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS 환경이면 true
}));

// 기본 미들웨어
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/auth', authRouter);


// 라우터 설정
app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/card', cardRouter);

app.use(errorHandler);

module.exports = app;