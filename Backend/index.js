const express = require('express');
const app = require('./app');
const authRoutes = require('./src/api/AuthRoute');

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
