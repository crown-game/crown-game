const gameRoomModel = require("../models/gameRoomModel");

const getRoomInfo = async (roomId) => {
    return await gameRoomModel.getRoomInfo(roomId);
};

module.exports = {
    getRoomInfo,
}