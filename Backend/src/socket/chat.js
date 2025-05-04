// src/socket/chat.js
const db = require("../config/db");

module.exports = (io, socket) => {
  socket.on("chat_message", async ({ roomId, userId, message }) => {
    try {
      // ✅ DB에서 금칙어 리스트 불러오기
      const [rows] = await db.query("SELECT forbid_text FROM forbidden_word");
      const forbiddenWords = rows.map(row => row.forbid_text);

      // ✅ 메시지에 금칙어 포함 여부 확인
      const containsForbidden = forbiddenWords.some(word => message.includes(word));

      if (containsForbidden) {
        console.log(`🚫 [${userId}] 금칙어 메시지 차단됨: ${message}`);
        socket.emit("chat_blocked", { message: "⚠️ 금칙어가 포함된 메시지는 전송할 수 없습니다." });
        return;
      }

      // ✅ 정상 메시지는 그대로 전송
      io.to(roomId).emit("chat_message", { userId, message });

    } catch (err) {
      console.error("❌ 금칙어 필터링 오류:", err);
      // 에러 시에도 메시지 전송을 막을지 여부는 선택 가능
    }
  });
};
