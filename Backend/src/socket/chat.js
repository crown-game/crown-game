// src/socket/chat.js

module.exports = (io, socket) => {
  socket.on("chat_message", ({ roomId, userId, message }) => {
    console.log(`💬 [${roomId}] ${userId}: ${message}`);
    io.to(roomId).emit("chat_message", { userId, message });
  });
};
