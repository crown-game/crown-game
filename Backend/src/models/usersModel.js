const db = require("../config/db");

const getWinnersByRoomId = async (roomId) => {
  const [rows] = await db.query(
    `
    SELECT UID
    FROM GAME_ROOM_USER
    WHERE GID = ?
      AND GAME_SCORE = (
        SELECT MAX(GAME_SCORE)
        FROM GAME_ROOM_USER
        WHERE GID = ?
      )
    `, [roomId, roomId]);
  return rows;
};

// 우승자에게 왕관 추가!
const addCrownToWinners = async (userId) => {
  await db.query(
    `
    UPDATE USERS
    SET CROWN_CNT = CROWN_CNT + 1
    WHERE UID = ?
    `, [userId]);
};

const getUserRanking = async () => {
    const [rows] = await db.query(
        `
        SELECT USERNAME, CROWN_CNT
        FROM USERS
        WHERE CROWN_CNT > 0
        ORDER BY CROWN_CNT DESC
        `
    );
    return rows;
};

const addScoreToUser = async (roomId, userId, points) => {
    await db.query(
        `
        UPDATE GAME_ROOM_USER
        SET GAME_SCORE = GAME_SCORE + ?
        WHERE GID = ? AND UID = ?;
        `, [points, roomId, userId]);
};

const getUserScore = async (roomId, userId) => {
    const [rows] = await db.query(
        `
        SELECT GAME_SCORE
        FROM GAME_ROOM_USER
        WHERE GID = ? AND UID = ?
        `
    , [roomId, userId]);
    return rows[0]?.GAME_SCORE || 0;
};

const getUserById = async (userId) => {
  return await db.query(`
    SELECT UID AS userId, USERNAME AS userName, PROFILE_IMG AS profileImg
    FROM USERS
    WHERE UID = ?
  `, [userId]);
};

module.exports = {
    getWinnersByRoomId,
    addCrownToWinners,
    getUserRanking,
    addScoreToUser,
    getUserScore,
    getUserById,
};