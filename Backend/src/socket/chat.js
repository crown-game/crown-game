const chatService = require("../services/chatService");

module.exports = (io, socket) => {
  socket.on("chat_message", async ({ roomId, message }) => {
    const userId = socket.user.userId;
    const userName = socket.user.userName;
    try {
      // DB에서 금지어 리스트 불러오기
      const containsForbidden = await chatService.checkForbidden(message);

      if (containsForbidden) {
        console.log(`🚫 [${userId}] 금칙어 메시지 차단됨: ${message}`);
        socket.emit("chat_blocked", { message: "⚠️ 금지어가 포함된 메시지는 전송할 수 없습니다." });
        return;
      }

      // 정상 메시지는 그대로 전송
      io.to(roomId).emit("chat_message", { userId, userName, message });

    } catch (err) {
      console.error("금지어 필터링 오류:", err);
    }
  });
};
