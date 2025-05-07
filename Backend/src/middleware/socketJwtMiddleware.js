// 소켓 JWT 인증 미들웨어
const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
    const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("토큰 없음"));
      }
    
      jwt.verify(token, "mySecretKey", (err, decoded) => {
        if (err) {
          return next(new Error("토큰 유효하지 않음"));
        }
        socket.user = decoded;  // 👈 소켓에 유저 정보 주입
        next();
      }
    );
};