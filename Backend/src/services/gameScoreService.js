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

const addScoreToUser = async (roomId, userId, points) => {
    await usersModel.addScoreToUser(roomId, userId, points);
};

const getUserScore = async (roomId, userId) => {
    return await usersModel.getUserScore(roomId, userId);
};

const getRanking = async() => {
    return await usersModel.getUserRanking();
};

module.exports = {
    getWinners,
    addCrownToWinners,
    addScoreToUser,
    getUserScore,
    getRanking,
};