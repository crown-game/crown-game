const gameRoomUserModel = require("../models/gameRoomUserModel");

const leaveRoom = async (roomId, userId) => {
    await gameRoomUserModel.leaveRoom(roomId, userId);
};

module.exports = {
    leaveRoom,
};