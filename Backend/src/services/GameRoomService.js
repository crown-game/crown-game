// db.js (mysql2 사용 설정이 되어 있어야 함)
const db = require('../config/db'); // ← db 연결 파일 경로 맞춰주세요

class GameRoomService {
    constructor() {
        this.rooms = new Map();
        this.roomIdCounter = 1;
    }

    async createGameRoom(masterId, roomConfig) {
        try {
            // 1. DB에 저장
            const [result] = await db.execute(
                `INSERT INTO GAME_ROOM (MASTER_UID, IS_ACTIVE, TOTAL_PLAYER, WAITING_PLAYER)
                 VALUES (?, ?, ?, ?)`,
                [masterId, false, roomConfig.maxPlayers, 1] // 방장 입장했으므로 대기인원 1
            );

            const gid = result.insertId; // DB에서 자동 생성된 GID

            // 2. 메모리에도 저장
            const newRoom = {
                roomId: gid,           // 이제는 GID가 roomId 역할
                masterId,
                players: [masterId],
                currentPlayers: 1,
                maxPlayers: roomConfig.maxPlayers,
                status: 'waiting'
            };

            this.rooms.set(gid, newRoom);

            return {
                roomId: gid,
                masterId,
                userId: masterId,
                maxPlayers: roomConfig.maxPlayers
            };
        } catch (err) {
            console.error('게임방 생성 중 DB 오류:', err);
            throw err;
        }
    }

    


    async joinGameRoom(roomId, userId) {
        const room = this.rooms.get(roomId);

        if (!room) {
            throw new Error('방을 찾을 수 없습니다');
        }

        if (room.players.includes(userId)) {
            return { message: '이미 입장한 유저입니다', ...room };
        }

        if (room.currentPlayers >= room.maxPlayers) {
            return { message: '방이 꽉 찼습니다', ...room };
        }

        // 메모리상 유저 입장 처리
        room.players.push(userId);
        room.currentPlayers++;

        // DB: WAITING_PLAYER 값 증가
        try {
            await db.execute(
                `UPDATE GAME_ROOM SET WAITING_PLAYER = ? WHERE GID = ?`,
                [room.currentPlayers, roomId]
            );
        } catch (err) {
            console.error('DB 업데이트 오류 (WAITING_PLAYER 증가):', err);
        }

        // 인원이 다 찼으면 상태 변경
        if (room.currentPlayers === room.maxPlayers) {
            room.status = '게임중';

            // DB: 상태 변경도 반영
            try {
                await db.execute(
                    `UPDATE GAME_ROOM SET IS_ACTIVE = ? WHERE GID = ?`,
                    [true, roomId]
                );
            } catch (err) {
                console.error('DB 업데이트 오류 (IS_ACTIVE 상태 변경):', err);
            }
        }

        return {
            message: '방에 입장했습니다',
            roomId: room.roomId,
            status: room.status,
            currentPlayers: room.currentPlayers,
            maxPlayers: room.maxPlayers,
            players: room.players
        };
    }

    generateGameId() {
        return this.roomIdCounter++;
    }
}

module.exports = GameRoomService;
