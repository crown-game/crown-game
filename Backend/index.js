const express = require('express');
const app = express();
const port = 3000;

// 필요한 서비스 및 클래스 import
const GameRoomService = require('./src/services/GameRoomService'); // GameRoomService 클래스 import

app.use(express.json()); // JSON 파싱 미들웨어

const gameRoomService = new GameRoomService(); // 게임방 서비스 인스턴스 생성

// 게임방 생성 API
// index.js
app.post('/game-room', (req, res) => {
    const { userId, roomConfig } = req.body;

    if (!userId || !roomConfig || !roomConfig.maxPlayers) {
      return res.status(400).json({ error: 'userId and roomConfig are required' });
    }

    const result = gameRoomService.createGameRoom(userId, roomConfig);
    res.status(201).json(result);
});


// 서버 실행
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
