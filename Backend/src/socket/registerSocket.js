// [connection 관련 로직]
// 소켓 연결 시 사용자 인증 및 이벤트 핸들러 등록

// ==============================================================================================
// 접속자 목록 위한
const {addConnectedUser, removeConnectedUser} = require("../services/connectedUserService");
const userModel = require("../models/usersModel");  // DB 접근용

// 핸들러
const roomHandler = require("./room");
const gameHandler = require("./game");
const chatHandler = require("./chat");

module.exports = (io) => {
    io.on("connection", async (socket) => {
      console.log(`🟢 연결됨: ${socket.id}`);
      const userId = socket.user.userId;
      
      const [rows] = await userModel.getUserById(userId);
    
      if (!rows || rows.length === 0) {
        console.error(`❌ 유저 ID ${userId}에 해당하는 정보가 DB에 없음`);
        socket.disconnect(); // 연결 강제 종료
        return;
      }
    
      const userInfo = {
        socketId: socket.id,
        userId: userId,
        userName: socket.user.userName,
        profileImg: rows[0].profileImg,
      };
    
      addConnectedUser(userId, userInfo);
    
      // 통신 끊기면
      socket.on("disconnect", () => {
        removeConnectedUser(userId);
        console.log(`🔴 연결 끊김: ${socket.id}`);
      });
    
      // 게임방 생성 및 참가가
      roomHandler(io, socket);
      gameHandler.registerGameHandlers(io, socket);
      chatHandler(io, socket);
    
      socket.emit("news", "Hello Socket.io");
    });
};