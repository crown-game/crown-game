// GameRoomServiceInterface.js

class GameRoomServiceInterface {
    /**
     * 게임방을 생성합니다.
     * @param {number} masterId - 방장 사용자 ID
     * @param {Object} roomConfig - 게임방 설정 정보
     * @param {number} roomConfig.maxPlayers - 최대 인원 수
     * @return {Object} 생성된 게임방의 기본 정보 (roomId, masterId, userId, maxPlayers)
     */
    createGameRoom(masterId, roomConfig) {}

    /**
     * 사용자를 게임방에 입장시킵니다.
     * @param {number} roomId - 입장할 게임방 ID
     * @param {number} userId - 입장하려는 사용자 ID
     * @return {Object} 입장 결과 메시지와 게임방 상태 정보
     */
    joinGameRoom(roomId, userId) {}

    /**
     * 고유한 게임방 ID를 생성합니다.
     * @return {number} 새로 생성된 고유 게임방 ID
     */
    generateGameId() {}
}

module.exports = GameRoomServiceInterface;
