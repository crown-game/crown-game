const express = require("express");
const router = express.Router();
const gameRoomService = require("../services/gameRoomService");
const gameRoomUserService = require("../services/gameRoomUserService"); // 게임 참여자 목록 받아오기 위해

// 전체 게임방 목록
router.get("/", async (req, res) => {
  try {
    const rooms = await gameRoomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "게임방 조회 실패" });
  }
});

// 특정 게임방의 유저 목록
router.get("/:roomId/players", async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const players = await gameRoomUserService.getPlayersInRoomByGID(roomId);
    res.json(players); // [{ userId, userName, profileImg }, ...]
  } catch (err) {
    console.error("[에러] 유저 목록 조회 실패:", err);
    res.status(500).json({ error: "유저 목록 조회 실패" });
  }
});

module.exports = router;
