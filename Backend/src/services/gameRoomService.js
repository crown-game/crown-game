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
    totalPlayer: roomInfo.totalPlayer,
    waitingPlayer: roomInfo.waitingPlayer,
    isActive: roomInfo.isActive,
  };
};

const addWaitingPlayer = async (roomId) => {
  await gameRoomModel.addWaitingPlayer(roomId);
};

const subWaitingPlayer = async (roomId) => {
  await gameRoomModel.subWaitingPlayer(roomId);
};

const getAllRooms = async() => {
  return await gameRoomModel.getAllRooms();
};

const setActive = async (roomId) => {
  await gameRoomModel.setActive(roomId);
};

const deleteRoom = async (roomId) => {
  await gameRoomModel.deleteRoom(roomId);
}

module.exports = {
    getRoomInfo,
    createGameRoom,
    addWaitingPlayer,
    subWaitingPlayer,
    getAllRooms,
    setActive,
    deleteRoom,
}