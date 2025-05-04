const db = require("../config/db");
const gameStates = new Map();   // 방별 게임 상태 저장

// game.js
async function startGameRounds(io, roomId, round) {
  console.log(`🎮 ${roomId}번 방 ${round}라운드 시작!`);

  // ✅ 1라운드 문제 25개 불러오기 (섞지 않고 고정 순서로)
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
    if (!questionsMap.has(row.QID)) {
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

    gameStates.set(roomId, {
        round,
        questionIndex: 0,   // questionIndex는 현재 라운드에서 몇 번째 문제를 내보냈는지를 의미하는 문제 진행 인덱스
        questions   
    });

    sendNextQuestion(io, roomId);
}

function sendNextQuestion(io, roomId) {
  const state = gameStates.get(roomId);
  if (!state) return;

  const { round, questionIndex, questions } = state;
  const currentRoundQuestions = questions;

  if (questionIndex >= currentRoundQuestions.length) {
    const nextRound = round + 1;

    // 5라운드 끝났으면 종료 처리
    // ✅ 5라운드가 끝났으면 종료 처리
    if (round >= 5) {
      io.to(roomId).emit("game_finished", {
        message: "🎉 게임이 종료되었습니다!",
      });
      gameStates.delete(roomId);  // 상태 초기화
      console.log(`🏁 ${roomId} 게임 종료됨`);
      return;
    }

    gameStates.set(roomId, {
      round: nextRound,
      questionIndex: 0,
      questions: [] // 새로운 라운드의 문제는 startGameRounds에서 다시 불러옴
    });
    io.to(roomId).emit("round_started", { round: nextRound });
    setTimeout(() => startGameRounds(io, roomId, nextRound), 2000);
    return;
  }

  const question = currentRoundQuestions[questionIndex];
  const shuffled = question.options.sort(() => Math.random() - 0.5);
  const answerIndex = shuffled.findIndex((opt) => opt.is_correct);

  state.answerIndex = answerIndex;
  state.questionId = question.id;
  state.questionIndex++;

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