import React, { useState, useEffect } from "react";
import socket from "../socket";

function RoomJoinTest() {
  const [roomId, setRoomId] = useState(100);
  const [userId, setUserId] = useState(1);
  const [logs, setLogs] = useState([]);
  const updateRoomUI = (roomId, waitingPlayer, totalPlayer, isActive) => {
    log(`❇️ 방 상태 업데이트: ${roomId} → ${waitingPlayer}/${totalPlayer}, 시작 여부: ${isActive}`);
    };

  useEffect(() => {
    socket.on("joined_room", ({ roomId, userId }) => {
      log(`✅ 본인 입장 완료: ${userId} → ${roomId}`);
    });

    socket.on("user_joined", ({ userId }) => {
      log(`👤 다른 유저 입장: ${userId}`);
    });

    // 입장시, 방 정보 변경
    socket.on("room_state_update", ({ roomId, waitingPlayer, totalPlayer, isActive }) => {
        updateRoomUI(roomId, waitingPlayer, totalPlayer, isActive); // ✅ 여기서 UI 반영
    });

    return () => {
      socket.off("joined_room");
      socket.off("user_joined");
      socket.off("room_state_update");
    };
  }, []);

  const log = (msg) => setLogs((prev) => [...prev, msg]);

  const handleJoinRoom = () => {
    socket.emit("join_room", { roomId, userId });
    log(`📨 join_room emit 보냄: roomId=${roomId}, userId=${userId}`);
  };

  return (
    <div>
      <h2>🎮 게임방 참가 테스트</h2>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" />
      <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <button onClick={handleJoinRoom}>방 입장</button>

      <div style={{ marginTop: "1rem", border: "1px solid gray", padding: "1rem", maxHeight: "200px", overflowY: "auto" }}>
        <h4>📋 로그:</h4>
        {logs.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}

export default RoomJoinTest;
