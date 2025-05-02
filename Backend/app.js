const path = require('path');
const express = require('express');
const app = express();
const authRoutes = require('./src/api/AuthRoute');

//이미지 접근 경로 등록하기
app.use('/uploads',express.static(path.join(__dirname, './src/uploads')));
app.use(express.json());
app.use('/auth', authRoutes);

module.exports = app;
