const db = require("../config/db");


const createRoom = async (masterId, totalPlayer) => {
    const [result] = await db.query(
    "INSERT INTO GAME_ROOM (MASTER_UID, TOTAL_PLAYER) VALUES (?, ?)",
    [masterId, totalPlayer]
  );
  return result.insertId;  // 바로 roomId 리턴
};

const getRoomInfo = async (roomId) => {
    const [rows] = await db.query(
        `
        SELECT IS_ACTIVE, TOTAL_PLAYER, WAITING_PLAYER
        FROM GAME_ROOM
        WHERE GID = ?;
        `, [roomId]);

    return rows[0];
};

module.exports = {
    createRoom,
    getRoomInfo,
}