// index.js
const express = require('express');
const bodyParser = require('body-parser');
const GameRoomService = require('./src/services/GameRoomService');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const gameRoomService = new GameRoomService();

// 게임방 생성 
app.post('/game-room', (req, res) => {
    const { masterId, roomConfig } = req.body;

    if (!masterId || !roomConfig || !roomConfig.maxPlayers) {
        return res.status(400).json({ error: 'masterId and maxPlayers are required' });
    }

    const result = gameRoomService.createGameRoom(masterId, roomConfig);
    res.status(201).json(result); // 생성된 게임방 정보 응답
});

//게임방 입장
app.post('/game-room/:roomId/join', (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const result = gameRoomService.joinGameRoom(roomId, userId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


// 서버 실행
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
