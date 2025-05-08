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
        //점수 차감 로직 추가
        await chatService.penalizeUser(userId);
        socket.emit("chat_blocked", { message: "⚠️ 금지어가 포함된 메시지는 전송할 수 없습니다. (점수 -10점)" });
        // 새로운 점수 가져오기
        const newScore = await gameScoreService.getUserScore(
                      roomId,
                      userId
                    );
        
        // 클라이언트에게 실시간 점수 전송
        io.to(roomId).emit("score_updated", {
          userId,
          score: newScore,
        });

        return;
      }

      // 정상 메시지는 그대로 전송
      io.to(roomId).emit("chat_message", { userId, userName, message });

    } catch (err) {
      console.error("금지어 필터링 오류:", err);
    }
  });
};

