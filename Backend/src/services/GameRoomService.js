class GameRoomService {
    constructor() {
        this.rooms = new Map();
        this.roomIdCounter = 1;  // 게임방 ID 카운터
    }

    createGameRoom(userId, roomConfig) {
    const roomId = this.generateGameId();

    const newRoom = {
        roomId,
        masterId: userId,              // 유저가 방장이 됨
        maxPlayers: roomConfig.maxPlayers,
        status: 'waiting',
        currentPlayers: 1,
        players: [userId],
    };

    this.rooms.set(roomId, newRoom);

    return {
        roomId: newRoom.roomId,
        masterId: newRoom.masterId,
        userId: newRoom.masterId     // 명시적으로 유저 ID도 리턴
    };
}


   

    // 게임방 ID 생성 메서드
    generateGameId() {
        return this.roomIdCounter++;  // ID 생성 후 증가
    }
}

module.exports = GameRoomService;
