const db = require("../config/db");

const getRoomInfo = async (roomId) => {
    const[rows] = await db.query(
        `
        SELECT IS_ACTIVE, TOTAL_PLAYER, WAITING_PLAYER
        FROM GAME_ROOM
        WHERE GID = ?;
        `, [roomId]);

    return rows[0];

};

module.exports = {
    getRoomInfo,
}