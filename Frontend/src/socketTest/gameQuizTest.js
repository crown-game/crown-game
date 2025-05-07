import React, { useEffect, useState, useContext } from "react";
import socket from "../socket"; // socket.io-client 인스턴스 경로 확인!
import {AuthContext} from "../context/AuthContext";

function GameQuizTest({roomId}) {   // props로 전달받음
  const {user} = useContext(AuthContext);
  const userId = user.userId;
  const [logs, setLogs] = useState([]);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [scores, setScores] = useState({});
  const TIME_LIMIT = 5; // 플젝에선 20초

  // 로그 찍기용
  const log = (msg) => {
    setLogs((prev) => [...prev, msg]);
    console.log(msg);
  };

  const handleLeaveRoom = () => {
    if (!roomId || !userId) return;

    socket.emit("leave_room", { roomId });
    log(`🚪 나가기 요청 전송: ${roomId}`);

    // 클라이언트 화면 전환 (예: 로비로 이동)
    // 만약 navigate 사용 중이라면:
    // navigate("/lobby");
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
      setTimeLeft(TIME_LIMIT);
    });

    // 문제 타이머
    socket.on("question_timer", ({remainingTime}) => {
      setTimeLeft(remainingTime);
    });

    // 라운드 시작 알림
    socket.on("round_started", ({ round }) => {
      log(`🔄 ${round}라운드 시작!`);
    });

    socket.on("score_updated", ({userId, score})=>{
      setScores(prev => ({
        ...prev,
        [userId]: score,
      }));
    });

    socket.on("game_forced_end", ({ message }) => {
      alert(message);
      // navigate("/lobby");
    });

    socket.on("game_finished", (data) => {
        alert(data.message); // "🎉 게임이 종료되었습니다!" 등
        // 게임 결과 화면 전환 등 후속 처리
    });

    socket.on("update_ranking", (rankingList)=>{
      log("👑 랭킹 업데이트 수신!");
      setRankingList(rankingList);
    })

    return () => {
      socket.off("countdown");
      socket.off("new_question");
      socket.off("round_started");
      socket.off("score_updated");
      socket.off("game_forced_end");
      socket.off("game_finished");
      socket.off("update_ranking");
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
    
    // 🔁 문제 타이머 값을 1초마다 줄이기
    useEffect(() => {
      if (timeLeft === null || timeLeft <= 0) return;

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // 컴포넌트 리렌더링 시 타이머 제거
    }, [timeLeft]);

    const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    socket.emit("submit_answer", {
        roomId,
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
      {timeLeft !== null && (
        <div style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
          ⏳ 남은 시간: {timeLeft}초
        </div>
      )}

      <button
        onClick={handleLeaveRoom}
        style={{
          marginTop: "1rem",
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c2c7",
          padding: "0.5rem",
          color: "#842029",
        }}
      >
        🚪 게임 나가기
      </button>

      {Object.keys(scores).length > 0 && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid gray", paddingTop: "1rem" }}>
          <h4>📊 실시간 점수판:</h4>
          <ul>
            {Object.entries(scores).map(([uid, score]) => (
              <li key={uid}>
                {uid === userId ? "나" : uid}: {score}점
              </li>
            ))}
          </ul>
        </div>
      )}


      <div style={{ marginTop: "1rem", borderTop: "1px solid gray", paddingTop: "1rem" }}>
        <h4>📋 로그:</h4>
        {logs.map((line, i) => <div key={i}>{line}</div>)}
      </div>

      {rankingList.length > 0 && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid gray", paddingTop: "1rem" }}>
          <h4>🏆 현재 랭킹 (왕관 수 기준):</h4>
          <ol>
            {rankingList.map((user, index) => (
              <li key={user.username}>
                {index === 0 ? "👑 " : ""}
                {user.USERNAME} - {user.CROWN_CNT}개
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
    
  );
}

export default GameQuizTest;
