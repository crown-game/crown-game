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

// 해당 게임방에 있는 플레이어들 가져오기
const getPlayersInRoomByGID = async (roomId) => {
    const [rows] = await db.query(
        `
        SELECT GRU.UID AS userId, U.USERNAME AS userName, U.PROFILE_IMG AS profileImg
        FROM GAME_ROOM_USER GRU
        JOIN USERS U USING(UID)
        WHERE GRU.GID = ?;
        `,
        [roomId]
    );
    return rows;
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
    getPlayersInRoomByGID,
};

