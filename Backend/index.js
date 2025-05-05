const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const gameRoomRoutes = require('../Backend/routes/gameRoomRoutes'); // 라우터 파일

const app = express();
const server = http.createServer(app); // Socket.IO를 위해 http 서버 생성
const io = new Server(server, {
    cors: {
        origin: '*', // 프론트 도메인에 맞게 설정
        methods: ['GET', 'POST']
    }
});

// 소켓 저장해서 다른 파일에서도 사용할 수 있도록 등록
app.set('io', io);

app.use(bodyParser.json());
app.use(gameRoomRoutes); // 라우터 등록

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
