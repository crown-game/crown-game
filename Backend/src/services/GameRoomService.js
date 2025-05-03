// src/services/GameRoomService.js
class GameRoomService {
    constructor() {
        this.rooms = new Map();
        this.roomIdCounter = 1; // 게임방 ID 증가용
    }

    // 게임방 생성
    createGameRoom(masterId, roomConfig) {
        const roomId = this.generateGameId();
        
        const newRoom = {
            roomId,
            masterId,               // 방장 ID
            players: [masterId],    // 방장도 유저로 입장
            currentPlayers: 1,
            maxPlayers: roomConfig.maxPlayers,
            status: 'waiting'
        };

        this.rooms.set(roomId, newRoom);

        return {
            roomId,
            masterId,
            userId: masterId,       // 방장도 유저이므로 명시적으로 userId 포함
            maxPlayers: roomConfig.maxPlayers
        };
    }

    


    joinGameRoom(roomId, userId) {
    const room = this.rooms.get(roomId);

    if (!room) {
        throw new Error('방을 찾을 수 없습니다');
    }

    // 이미 입장한 유저인지 확인
    if (room.players.includes(userId)) {
        return { message: '이미 입장한 유저입니다', ...room };
    }

    // 방이 가득 찼는지 확인
    if (room.currentPlayers >= room.maxPlayers) {
        return { message: '방이 꽉 찼습니다', ...room };
    }

    // 유저 추가 및 현재 인원 증가
    room.players.push(userId);
    room.currentPlayers++;

    // 인원이 다 찼으면 상태 변경
    if (room.currentPlayers === room.maxPlayers) {
        room.status = '게임중';
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
    // 게임방 ID 생성
    generateGameId() {
        return this.roomIdCounter++;
    }

}

module.exports = GameRoomService;
