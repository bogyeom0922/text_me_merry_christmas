const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const homeRouter = require('./src/routes/home');
const userRouter = require('./src/routes/user');
const cardRouter = require('./src/routes/card');
const { errorHandler } = require('./src/middlewares/errorHandler');

const app = express();

// 기본 미들웨어
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 라우터 설정
app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/card', cardRouter);

app.use(errorHandler);

module.exports = app;