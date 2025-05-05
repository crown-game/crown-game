const gameRoomModel = require("../models/gameRoomModel");
const gameRoomUserModel = require("../models/gameRoomUserModel");

const getRoomInfo = async (roomId) => {
    return await gameRoomModel.getRoomInfo(roomId);
};

const createGameRoom = async (masterId, totalPlayer) => {
  // 1. 방 생성 후 roomId 얻기
  const roomId = await gameRoomModel.createRoom(masterId, totalPlayer);
  
  // 2. 방장 DB 등록 (인자로 받은 masterId 사용해야 함)
  await gameRoomUserModel.joinRoom(roomId, masterId);

  // 3. room 정보 조회해서 리턴
  const roomInfo = await gameRoomModel.getRoomInfo(roomId);

  return {
    roomId,
    masterId,
    totalPlayer: roomInfo.TOTAL_PLAYER,
    waitingPlayer: roomInfo.WAITING_PLAYER,
    isActive: roomInfo.IS_ACTIVE,
  };
};

module.exports = {
    getRoomInfo,
    createGameRoom,
}