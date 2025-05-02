// index.js 서버 실행 진입점
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
})); // CORS 미들웨어 적용

const server = http.createServer(app);

const { Server } = require("socket.io"); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});


io.on("connection", (socket) => { // 클라이언트가 연결되었을 때
  console.log(`🟢 연결됨: ${socket.id}`); // 연결된 클라이언트의 socket.id 출력

  // 클라이언트로부터 'chat message' 이벤트를 받으면
  socket.on("chat message", (msg) => {
    console.log("메시지 받은 것:", msg);  // 받은 메시지 출력
    io.emit("chat message", msg);  // 모든 클라이언트에게 메시지 전송
  });

  // 클라이언트와의 소켓 통신 이벤트 예시
  socket.on("disconnect", () => {
    console.log(`🔴 연결 끊김: ${socket.id}`); // 클라이언트 연결이 끊겼을 때 출력
  });
});

// 서버 실행
server.listen(5001, () => {
  console.log("🚀 서버 실행 중: http://localhost:5001");
});
