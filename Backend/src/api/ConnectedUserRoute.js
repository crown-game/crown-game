// src/api/ConnectedUserRoute.js
const express = require("express");
const router = express.Router();
const { getConnectedUsers } = require("../services/connectedUserService");

router.get("/", (req, res) => {
  const users = Array.from(getConnectedUsers().values());
  res.json({ connectedUsers: users });
});

module.exports = router;
