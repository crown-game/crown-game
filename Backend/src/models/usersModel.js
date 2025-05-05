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

// const getUsersRanking = async () => {
//     const [rows] = await db.query(
//         `
//         SELECT 
//         `
//     );
//     return rows;
// };

module.exports = {
    getWinnersByRoomId,
    addCrownToWinners,
};