module.exports = (io, socket) => {
    socket.on("create_room", ({ roomId, masterId, totalPlayer }) => {
        // 서버에서 받은 내용 출력 (emit 잘 도착했는지 확인용)
        console.log(`📥 create_room 수신: roomId=${roomId}, masterId=${masterId}, totalPlayer=${totalPlayer}`);

        socket.join(roomId);    // Socket.IO에서 현재 연결된 클라이언트를 특정 "룸(room)"에 추가하는 명령

        socket.emit("room_created", {
            roomId,
            masterId,
            totalPlayer,
        });
        console.log(`📨 네임스페이스 안에 ${roomId}이라는 이름의 룸 생성 완료!`);
    });
};