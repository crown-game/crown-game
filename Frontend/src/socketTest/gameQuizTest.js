import React, { useEffect, useState } from "react";
import socket from "../socket"; // socket.io-client 인스턴스 경로 확인!

function GameQuizTest({roomId, userId}) {   // props로 전달받음
  const [logs, setLogs] = useState([]);
  const [question, setQuestion] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

//   // 👉 테스트용 roomId/userId
//   const roomId = 100;
//   const userId = 1;

  // 로그 찍기용
  const log = (msg) => {
    setLogs((prev) => [...prev, msg]);
    console.log(msg);
  };

  useEffect(() => {
    if (!roomId || !userId) return;

    // 게임 시작 타이머
    socket.on("countdown", ({ seconds }) => {
      log(`⏱ 게임이 ${seconds}초 후에 시작됩니다!`);
      setCountdown(seconds);
    });

    // 문제 수신
    socket.on("new_question", (q) => {
      log(`🧠 문제 도착: ${q.text}`);
      setQuestion(q);
      setSelectedAnswer(null);
      setCountdown(null); // 타이머 종료
    });

    // 라운드 시작 알림
    socket.on("round_started", ({ round }) => {
      log(`🔄 ${round}라운드 시작!`);
    });

    socket.on("game_finished", (data) => {
        alert(data.message); // "🎉 게임이 종료되었습니다!" 등
        // 게임 결과 화면 전환 등 후속 처리
    });

    return () => {
      socket.off("countdown");
      socket.off("new_question");
      socket.off("round_started");
      socket.off("game_finished");
    };
  }, [roomId, userId]);

  // 🔁 countdown 값을 보고 1초마다 줄이기
    useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
        setCountdown((prev) => {
        if (prev === 1) {
            clearInterval(timer);
            return null;
        }
        return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer); // cleanup
    }, [countdown]);

    const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    socket.emit("submit_answer", {
        roomId,
        userId,
        answerIndex: index,
    });

    log(`📤 게임방: ${roomId} / 유저명:${userId} / 정답 제출: ${index + 1}번 선택`);
  };

 return (
    <div>
      <h2>🧪 게임 문제 출제 테스트</h2>

      {countdown !== null && (
        <div style={{ fontSize: "1.5rem", color: "orange" }}>
          ⏳ 게임 시작까지: {countdown}초
        </div>
      )}

      {question && (
        <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Round{question.round} - Q{question.number}. {question.text}</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {question.options.map((opt, i) => (
              <li key={i}>
                <button
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  style={{
                    backgroundColor: selectedAnswer === i ? "#d1e7dd" : "#fff",
                    border: "1px solid #ccc",
                    padding: "0.5rem",
                    marginBottom: "0.5rem",
                    width: "100%",
                    textAlign: "left"
                  }}
                >
                  {i + 1}. {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "1rem", borderTop: "1px solid gray", paddingTop: "1rem" }}>
        <h4>📋 로그:</h4>
        {logs.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}

export default GameQuizTest;
