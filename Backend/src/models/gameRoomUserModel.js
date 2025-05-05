const db = require("../config/db");

// 추가
const joinRoom = async(roomId, userId) => {
    await db.query(
        `
        INSERT INTO GAME_ROOM_USER (GID, UID)
        VALUES(?, ?)
        `,
        [roomId, userId]
    );
};

const leaveRoom = async (roomId, userId) => {
    await db.query(
    `
    DELETE 
    FROM GAME_ROOM_USER
    WHERE GID = ? AND UID = ?
    `, [roomId, userId]);
};

module.exports = {
    joinRoom,
    leaveRoom,
};

