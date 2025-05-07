const db = require("../config/db");


const createRoom = async (masterId, totalPlayer) => {
    const [result] = await db.query(
    "INSERT INTO GAME_ROOM (MASTER_UID, TOTAL_PLAYER, WAITING_PLAYER) VALUES (?, ?, 1)",
    [masterId, totalPlayer]
  );
  return result.insertId;  // 바로 roomId 리턴
};

const getRoomInfo = async (roomId) => {
    const [rows] = await db.query(
        `
        SELECT 
            IS_ACTIVE  AS isActive,
            TOTAL_PLAYER AS totalPlayer,
            WAITING_PLAYER AS waitingPlayer
        FROM GAME_ROOM
        WHERE GID = ?
        `, [roomId]);

    return rows[0];
};

const addWaitingPlayer = async (roomId) => {
    await db.query(
        `
        UPDATE GAME_ROOM
        SET WAITING_PLAYER = WAITING_PLAYER + 1
        WHERE GID = ?
        `,
        [roomId]
    );
};

const subWaitingPlayer = async (roomId) => {
    await db.query(
        `
        UPDATE GAME_ROOM
        SET WAITING_PLAYER = WAITING_PLAYER - 1
        WHERE GID = ?
        `,
        [roomId]
    );
};

const setActive = async (roomId) => {
    await db.query(
        `
        UPDATE GAME_ROOM
        SET IS_ACTIVE = 1
        WHERE GID = ?
        `, 
        [roomId]
    );
};

const getAllRooms = async () => {
  const [rows] = await db.query(`
    SELECT 
      GID AS roomId,
      MASTER_UID AS masterId,
      TOTAL_PLAYER AS totalPlayer,
      WAITING_PLAYER AS waitingPlayer,
      IS_ACTIVE AS isActive
    FROM GAME_ROOM
  `);
  return rows;
};

const deleteRoom = async (roomId) => {
    await db.query(
        `
        DELETE
        FROM GAME_ROOM
        WHERE GID=?;
        `,
        [roomId]
    );
};

module.exports = {
    createRoom,
    getRoomInfo,
    addWaitingPlayer,
    subWaitingPlayer,
    getAllRooms,
    setActive,
    deleteRoom,
}