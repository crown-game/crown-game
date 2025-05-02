module.exports = (io, socket) => {
    socket.on("create_room", ({ roomId, masterId, totalPlayer }) => {
        // ✅ 게임 방 만들기(emit 잘 도착했는지 확인용)
        console.log(`📥 create_room 수신: roomId=${roomId}, masterId=${masterId}, totalPlayer=${totalPlayer}`);

        socket.join(roomId);    // Socket.IO에서 현재 연결된 클라이언트를 특정 "룸(room)"에 추가하는 명령

        socket.emit("room_created", {
            roomId,
            masterId,
            totalPlayer,
        });
        console.log(`📨 네임스페이스 안에 ${roomId}이라는 이름의 룸 생성 완료!`);

        // 방장 gameRoomUser 테이블에 넣는 로직 있어야 함!
        const waitingPlayer = 1; // 일단 임시값
        const totalPlayer = 2; // 일단 임시값

        // ✅ 방 생성 직후 모든 사용자에게 실시간 알림
        io.emit("room_state_update", {
            roomId,
            waitingPlayer,        // 방장은 바로 들어온 상태
            totalPlayer,
            isActive: false            // 아직 게임 시작 안됨
        });
        
    });

    // ✅ 플레이어가 게임방에 입장 (
    socket.on("join_room", ({ roomId, userId }) => {
        console.log(`📥 join_room 수신: roomId=${roomId}, userId=${userId}`);

    socket.join(roomId); // 룸 참가

    // 1. DB에 userId, roomId 저장 (gameRoomUser 테이블)

    // 2. 현재 인원 수 조회 (방에 몇 명 있는지)
    const waitingPlayer = 2;    // 예시임

    // 3. 전체 인원 수 조회 (gameRoom 테이블에서 가져오기)
    const totalPlayer = 5;  // 예시임

    // 해당 네임스페이스에 실시간 전송
    // 로비에서 대기 중인 사용자에게 필요한 정보니까.
    io.emit("room_state_update", {
        roomId,
        waitingPlayer,
        totalPlayer,
        isActive: false,  // 시작이 true
    });

    // 입장 알림 기능 괜찮은데?
    // 본인에게 입장 완료 알림
    socket.emit("joined_room", { roomId, userId });

    // 같은 방에 있는 다른 사람들에게 입장 알림
    socket.to(roomId).emit("user_joined", { userId });
  });

};