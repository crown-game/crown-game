const express = require("express");
const router = express.Router();
const gameRoomService = require("../services/gameRoomService");

// 전체 게임방 목록
router.get("/", async (req, res) => {
  try {
    const rooms = await gameRoomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "게임방 조회 실패" });
  }
});


module.exports = router;
