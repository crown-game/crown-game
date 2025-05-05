const express = require('express');
const router = express.Router();
const GameRoomService = require('../src/services/GameRoomService');

const gameRoomService = new GameRoomService();

// 게임방 생성
router.post('/game-room', async (req, res) => {
    const { masterId, roomConfig } = req.body;
    const io = req.app.get('io'); // 소켓 인스턴스 가져오기

    if (!masterId || !roomConfig || !roomConfig.maxPlayers) {
        return res.status(400).json({ error: 'masterId and maxPlayers are required' });
    }

    try {
        const result = await gameRoomService.createGameRoom(masterId, roomConfig);
        
        // ✅ 소켓 이벤트 전송
        io.emit("room_created", result);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: '게임방 생성 실패' });
    }
});

// 게임방 입장
router.post('/game-room/:roomId/join', async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const { userId } = req.body;
    const io = req.app.get('io');

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const result = await gameRoomService.joinGameRoom(roomId, userId);

        // ✅ 해당 방에 broadcast
        io.emit("user_joined", { roomId, userId });

        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


module.exports = router;
