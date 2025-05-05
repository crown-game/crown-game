const gameRoomUserModel = require("../models/gameRoomUserModel");

const joinRoom = async(roomId, userId) => {
    await gameRoomUserModel.joinRoom(roomId, userId);
};

const leaveRoom = async (roomId, userId) => {
    await gameRoomUserModel.leaveRoom(roomId, userId);
};

module.exports = {
    joinRoom,
    leaveRoom,
};