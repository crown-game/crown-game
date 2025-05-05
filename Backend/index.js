// index.js 서버 실행 진입점
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const jwt = require("jsonwebtoken");
// 라우터 등록
const authRoutes = require("./src/api/AuthRoute");
const rankingRoutes = require("./src/api/RankingRoute");

const app = express();
app.use(cors());  // cors 허용
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // form 요청 파싱

//이미지 접근 경로 등록하기
app.use('/uploads',express.static(path.join(__dirname, './src/uploads')));
// 라우터 연결
app.use("/auth", authRoutes);
app.use("/ranking", rankingRoutes);

const server = http.createServer(app);

// 소켓 통신 테스트 - 핸들러 연결
const roomHandler = require("./src/socket/room");
const gameHandler = require("./src/socket/game");
const chatHandler = require("./src/socket/chat");

// 소켓 서버 생성
const io = new Server(server, {
  cors: {
    origin: "*",  // 개발 중만 사용! 배포 시엔 꼭 제한해야 함
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  }
});

// ✅ 소켓 JWT 인증 미들웨어 (2단계)
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("토큰 없음"));
//   }

//   jwt.verify(token, "mySecretKey", (err, decoded) => {
//     if (err) {
//       return next(new Error("토큰 유효하지 않음"));
//     }
//     socket.user = decoded;  // 👈 소켓에 유저 정보 주입
//     next();
//   });
// });

// 확인용
app.get('/', (req, res) => {
  res.send('<h1>서버 생성 완료</h1>');
});

// 소켓 연결
io.on("connection", (socket) => { // 클라이언트가 연결되었을 때
  console.log(`🟢 연결됨: ${socket.id}`); // 연결된 클라이언트의 socket.id 출력

  // 클라이언트와의 소켓 통신 이벤트 예시
  socket.on("disconnect", () => {
    console.log(`🔴 연결 끊김: ${socket.id}`); // 클라이언트 연결이 끊겼을 때 출력
  });

  // 게임방 생성 및 참가가
  roomHandler(io, socket);
  gameHandler.registerGameHandlers(io, socket);
  chatHandler(io, socket);

  socket.emit("news", "Hello Socket.io");
});

// 서버 실행
server.listen(5001, () => {
  console.log("🚀 서버 실행 중: http://localhost:5001");
});
