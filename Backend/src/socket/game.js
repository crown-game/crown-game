const db = require("../config/db");
const gameStates = new Map();   // 방별 게임 상태 저장

// game.js
async function startGameRounds(io, roomId, round) {
  console.log(`🎮 ${roomId}번 방 ${round}라운드 시작!`);

  // ✅ 1라운드 문제 5개 불러오기 (섞지 않고 고정 순서로)
  // 문항 선택은 5문제 5개 => 25개
  const [rows] = await db.query(`
    SELECT *
    FROM QUIZ
    JOIN QUIZ_OPTION USING (QID)
    WHERE ROUND = ?
    ORDER BY QID
    LIMIT 25
  `, [round]);

  // 문제 묶기 (qid 기준으로)
  const questionsMap = new Map();
  for (const row of rows) {
    // questionsMap에 해당 QID가 아직 없는 경우
    // 이 조건문은 새로운 질문(QID)을 처음 만났을 때 해당 질문의 기본 구조를 questionsMap에 추가하는 역할
    if (!questionsMap.has(row.QID)) {
        // questionsMap에 새로운 키-값 쌍을 추가
        questionsMap.set(row.QID, {
            id: row.QID,
            text: row.QUESTION,
            options: [],
        });
    }
    questionsMap.get(row.QID).options.push({
      option_text: row.CHOICE,
      is_correct: row.IS_CORRECT,
    });
    }

    const questions = Array.from(questionsMap.values());

    // gameStates.set(roomId, {
    //     round,
    //     questionIndex: 0,   // questionIndex는 현재 라운드에서 몇 번째 문제를 내보냈는지를 의미하는 문제 진행 인덱스
    //     questions   
    // });

    // ✅ 기존 상태 유지하며 round, questionIndex, questions만 갱신
    const prevState = gameStates.get(roomId) || {};
        gameStates.set(roomId, {
        ...prevState,          // 기존 상태 유지
        round,                 // 새로운 라운드 번호 덮어쓰기
        questionIndex: 0,      // 문제 인덱스 초기화
        questions              // 새 문제 리스트
    });

    sendNextQuestion(io, roomId);
}

function sendNextQuestion(io, roomId) {
  const state = gameStates.get(roomId);
  if (!state) return;

  const { round, questionIndex, questions } = state;
//   const currentRoundQuestions = questions;

  if (questionIndex >= questions.length) {
    const nextRound = round + 1;

    // 5라운드 끝났으면 종료 처리
    if (round >= 5) {
      io.to(roomId).emit("game_finished", {
        message: "🎉 게임이 종료되었습니다!",
      });
      gameStates.delete(roomId);  // 상태 초기화
      console.log(`🏁 ${roomId} 게임 종료됨`);
      return;
    }

    io.to(roomId).emit("round_started", { round: nextRound });
    setTimeout(() => startGameRounds(io, roomId, nextRound), 2000);
    return;
  }

  const question = questions[questionIndex];
  const shuffled = question.options.sort(() => Math.random() - 0.5);
  const answerIndex = shuffled.findIndex((opt) => opt.is_correct);

  state.answerIndex = answerIndex;
  state.questionId = question.id;
  state.questionIndex++;
  gameStates.set(roomId, state);    // ✅ 상태 업데이트 명시적으로 저장

  io.to(roomId).emit("new_question", {
    round,
    number: state.questionIndex,
    questionId: question.id,
    text: question.text,
    options: shuffled.map((opt) => opt.option_text),
  });

  console.log(`🧠 ${roomId} 문제 전송: 라운드 ${round}, 문제 ${state.questionIndex}`);
}

function registerGameHandlers(io, socket) {
  socket.on("submit_answer", ({ roomId, userId, answerIndex }) => {
    const state = gameStates.get(roomId);
    if (!state) return;

    const correct = answerIndex === state.answerIndex;
    console.log(`📥 ${userId} → ${roomId} 정답 제출: ${correct ? "⭕ 정답" : "❌ 오답"}`);

    // TODO: 점수 저장 등 처리 가능

    setTimeout(() => sendNextQuestion(io, roomId), 2000);
  });
}

module.exports = {
  startGameRounds,
  registerGameHandlers,
};