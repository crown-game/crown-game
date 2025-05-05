const usersModel = require("../models/usersModel");

const getWinners = async (roomId) => {
    return await usersModel.getWinnersByRoomId(roomId);
};

// 우승자 배열을 받아서 각각에게 왕관 + 1
const addCrownToWinners = async(winners) => {
    for (const winner of winners) {
        await usersModel.addCrownToWinners(winner.UID);
    }
};

module.exports = {
    getWinners,
    addCrownToWinners,
};