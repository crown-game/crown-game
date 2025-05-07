// index.js 서버 실행 진입점
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const socketJwtMiddleware = require("./src/middleware/socketJwtMiddleware");

// 라우터 등록
const authRoutes = require("./src/api/AuthRoute");
const rankingRoutes = require("./src/api/RankingRoute");
const gameRoomRoutes = require("./src/api/GameRoomRoute");
const connectedUserRoute = require("./src/api/ConnectedUserRoute");

const app = express();
app.use(cors());  // cors 허용
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // form 요청 파싱

//이미지 접근 경로 등록하기
app.use('/uploads',express.static(path.join(__dirname, './src/uploads')));

// 라우터 연결
app.use("/auth", authRoutes);
app.use("/ranking", rankingRoutes);
app.use("/gameroom", gameRoomRoutes);
app.use("/connected_users", connectedUserRoute);

const server = http.createServer(app);

// 소켓 통신 연결 위해!
const registerSocket = require("./src/socket/registerSocket");

// 소켓 서버 생성
const io = new Server(server, {
  cors: {
    origin: "*",  // 개발 중만 사용! 배포 시엔 꼭 제한해야 함
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  }
});

// 소켓 JWT 인증 미들웨어
io.use(socketJwtMiddleware);

// 확인용
app.get('/', (req, res) => {
  res.send('<h1>서버 생성 완료</h1>');
});

// 소켓 연결 -> 로그인 완료시 연결됨.
registerSocket(io);

// 서버 실행
server.listen(5001, () => {
  console.log("🚀 서버 실행 중: http://localhost:5001");
});
