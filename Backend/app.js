const path = require('path');
const express = require('express');
const app = express();
const cors = require("cors");
const authRoutes = require('./src/api/AuthRoute');


// cors 허용 
app.use(cors());

// json 및 form-dataa 처리 
app.use(express.json()); // json 에 요청 처리 
app.use(express.urlencoded({extended : true})); // userName , password  파싱 할 때 필요요

//이미지 접근 경로 등록하기
app.use('/uploads',express.static(path.join(__dirname, './src/uploads')));
//라우터 등록하기기
app.use('/auth', authRoutes);

module.exports = app;
