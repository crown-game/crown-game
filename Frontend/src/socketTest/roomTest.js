import React, { useEffect, useState } from "react";
import socket from "../socket"; // socket.io-client instance

function RoomCreateTest() {
  const [masterId, setMasterId] = useState(1);
  const [roomId, setRoomId] = useState(100); // 수동 입력
  const [totalPlayer, setTotalPlayer] = useState(2);
  const [logs, setLogs] = useState([]); // 👉 로그를 저장할 상태 (배열) => UI 보여주기용
  const updateRoomUI = (roomId, waitingPlayer, totalPlayer, isActive) => {
    log(`❇️ 방 상태 업데이트: ${roomId} → ${waitingPlayer}/${totalPlayer}, 시작 여부: ${isActive}`);
    };

  useEffect(() => {
    socket.on("room_created", ({ roomId, masterId, totalPlayer }) => {
      log(`✅ room_created 수신: roomId=${roomId}, masterId=${masterId}, totalPlayer=${totalPlayer}`);
      setRoomId(roomId);
    });

    // 방 생성 후 방 정보 변경
    socket.on("room_state_update", ({ roomId, waitingPlayer, totalPlayer, isActive }) => {
        updateRoomUI(roomId, waitingPlayer, totalPlayer, isActive); // ✅ 여기서 UI 반영
    });

    return () => {
      socket.off("room_created");
      socket.off("room_state_update");
    };
  }, []);

  const log = (text) => {
    setLogs((prev) => [...prev, text]); // 👉 이전 로그 배열에 새 로그 추가
    console.log(text);  // 👉 콘솔에도 출력 (선택사항)
  };

  const handleCreateRoom = async () => {
    if (!roomId || !masterId) {
      log("❌ roomId와 masterId를 입력하세요.");
      return;
    }

    try {
      // 1. REST API로 방 생성 → roomId 받아오기
      
      // 2. 소켓 emit으로 서버에 room 생성 알림
      socket.emit("create_room", {
        roomId: Number(roomId),
        masterId: Number(masterId),
        totalPlayer: Number(totalPlayer),
      });

      log(`📨 socket.emit("create_room") 호출: roomId=${roomId}, masterId=${masterId}, totalPlayer=${totalPlayer}`);
    } catch (err) {
      log("❌ 에러 발생: " + err.message);
    }
  };

return (
    <div>
      <h2>🎮 방 만들기 (소켓 테스트)</h2>

      <label>User ID: </label>
      <input value={masterId} onChange={(e) => setMasterId(e.target.value)} />

      <label>Room ID: </label>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />

      <label>Max Players: </label>
      <input
        type="number"
        value={totalPlayer}
        onChange={(e) => setTotalPlayer(e.target.value)}
        style={{ width: "60px" }}
      />

      <button onClick={handleCreateRoom}>방 만들기</button>

      <div style={{ marginTop: "1rem", border: "1px solid gray", padding: "1rem", maxHeight: "200px", overflowY: "auto" }}>
        <h4>📋 로그:</h4>
        {logs.map((line, i) => (
          <div key={i}>{line}</div> // 👉 로그를 하나씩 화면에 표시
        ))}
      </div>
    </div>
  );
}

export default RoomCreateTest;
