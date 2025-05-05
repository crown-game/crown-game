const db = require("../config/db");

const leaveRoom = async (roomId, userId) => {
    await db.query(
    `
    DELETE 
    FROM GAME_ROOM_USER
    WHERE GID = ? AND UID = ?
    `, [roomId, userId]);
};

module.exports = {
    leaveRoom,
};

