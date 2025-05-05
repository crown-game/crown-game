const {startGameRounds} = require("./game");
const gameRoomService = require("../services/gameRoomService");

module.exports = (io, socket) => {
    socket.on("create_room", async ({ masterId, totalPlayer }) => {
        try{
            // 방 만들기 -> 방장 등록 + roomInfo 리턴까지 다 포함됨
            const roomInfo = await gameRoomService.createGameRoom(masterId, totalPlayer);

            // 방장 소켓 룸 참가
            socket.join(roomInfo.roomId);

            socket.emit("room_created", roomInfo);
            console.log(`📨 네임스페이스 안에 ${roomInfo.roomId}이라는 이름의 룸 생성 완료!`);
            
            // 전체 사용자에게 상태 업데이트 알림
            io.emit("room_state_update", roomInfo);
        }catch(err){
            console.error("[에러] 방 생성 실패:", err);
        }
    });

    // ✅ 플레이어가 게임방에 입장 (
    socket.on("join_room", ({ roomId, userId }) => {
        console.log(`📥 join_room 수신: roomId=${roomId}, userId=${userId}`);

    socket.join(roomId); // 룸 참가

    // 1. DB에 userId, roomId 저장 (gameRoomUser 테이블)

    // 2. 현재 인원 수 조회 (방에 몇 명 있는지)
    const waitingPlayer = 5;    // 예시임

    // 3. 전체 인원 수 조회 (gameRoom 테이블에서 가져오기)
    const totalPlayer = 5;  // 예시임

    const isActive = waitingPlayer === totalPlayer; // ✅ 참가 인원 다 찼으면 게임 시작

    // 해당 네임스페이스에 실시간 전송
    // 로비에서 대기 중인 사용자에게 필요한 정보니까.
    io.emit("room_state_update", {
        roomId,
        waitingPlayer,
        totalPlayer,
        isActive  // 시작이 true
    });

    // 입장 알림 기능 괜찮은데?
    // 본인에게 입장 완료 알림
    socket.emit("joined_room", { roomId, userId });

    // 같은 방에 있는 다른 사람들에게 입장 알림
    socket.to(roomId).emit("user_joined", { userId });

    // 게임방 내부 참가자에게 게임 시작 알림!
    if(isActive){
        io.to(roomId).emit("game_started", {roomId});
        console.log(`🎮${roomId}번 게임방 게임 시작!!`);

        // ✅ 곧 1라운드 첫 문제가 시작된다는 타이머 알림 보내기!
        io.to(roomId).emit("countdown", { seconds: 5 }); // 클라이언트가 5초 카운트다운 시작

        // ✅ 5초 후 첫 문제 출제
        setTimeout(() => {
            console.log(`⏳ 5초 후 startGameRounds 실행!`);
            // io.to(roomId).emit("start_game_rounds", { roomId }); // emit으로 game.js에 시작 신호 보냄
            startGameRounds(io, roomId, 1);  // 직접 함수 실행! 1라운드부터 실행.
        }, 5000);
    }
  });

};