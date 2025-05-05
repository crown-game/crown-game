const gameStates = new Map();   // 방별 게임 상태 저장
const questionTimer = new Map();  // 문제마다 제한 시간 재는 타이머
const quizService = require("../services/quizService");
const gameScoreService = require("../services/gameScoreService");
const gameRoomService = require("../services/gameRoomService");
const gameRoomUserService = require("../services/gameRoomUserService");

// game.js
async function startGameRounds(io, roomId, round) {
  console.log(`🎮 ${roomId}번 방 ${round}라운드 시작!`);

  const questions = await quizService.buildQuestions(round);

    // ✅ 기존 상태 유지하며 round, questionIndex, questions만 갱신
    const prevState = gameStates.get(roomId) || {};
        gameStates.set(roomId, {
        ...prevState,          // 기존 상태 유지
        round,                 // 새로운 라운드 번호 덮어쓰기
        questionIndex: 0,      // 문제 인덱스 초기화
        questions,              // 새 문제 리스트
        correctUsers: []      // 문제마다 맞은 사람들만 넣을 배열!
    });

    sendNextQuestion(io, roomId);
}

async function sendNextQuestion(io, roomId) {
  const state = gameStates.get(roomId);
  if (!state) return;

  const { round, questionIndex, questions } = state;

  if (questionIndex >= questions.length) {
    const nextRound = round + 1;

    // 5라운드 끝났으면 종료 처리
    if (round >= 5) {
      // db에서 우승자 가져오기!
      const winners = await gameScoreService.getWinners(roomId);

      // 우승자 왕관 하나 추가
      await gameScoreService.addCrownToWinners(winners);

      io.to(roomId).emit("game_finished", {
        message: "🎉 게임이 종료되었습니다!",
        // scores: Object.fromEntries(userScores),  // userId별 점수 객체 전송
      });

      // 전체 랭킹 다시 불러와서 로비로 broadcast
      // 이 부분 DB 연결 필요!
      const rankingRows = [
        { username: "Alice", crown_cnt: 5 },
        { username: "Bob", crown_cnt: 4 },
        { username: "Charlie", crown_cnt: 3 },
        { username: "Diana", crown_cnt: 2 },
        { username: "Eve", crown_cnt: 1 },
      ];

      io.emit("update_ranking", rankingRows);
      console.log("👑 랭킹 전송 완료:", rankingRows);

      gameStates.delete(roomId);  // 상태 초기화
      questionTimer.delete(roomId);
      console.log(`🏁 ${roomId} 게임 종료됨`);
      return;
    }

    io.to(roomId).emit("round_started", { round: nextRound });
    setTimeout(() => startGameRounds(io, roomId, nextRound), 2000); // NEXT ROUND 시작 전 2초 기다림
    return;
  }

  const question = questions[questionIndex];
  const shuffled = question.options.sort(() => Math.random() - 0.5);
  const answerIndex = shuffled.findIndex((opt) => opt.is_correct);

  state.answerIndex = answerIndex;
  state.questionId = question.id;
  state.questionIndex++;
  state.correctUsers = []; // 새 문제이므로 초기화
  gameStates.set(roomId, state);    // 상태 업데이트 명시적으로 저장

  io.to(roomId).emit("new_question", {
    round,
    number: state.questionIndex,
    questionId: question.id,
    text: question.text,
    options: shuffled.map((opt) => opt.option_text),
  });

  console.log(`🕹️ ${roomId} 문제 전송: 라운드 ${round}, 문제 ${state.questionIndex}`);

  // 기존 타이머가 있다면 제거
  if (questionTimer.has(roomId)) {
    clearTimeout(questionTimer.get(roomId));
  }

  // 새로운 타이머 설정 (예: 10초)
  const timerId = setTimeout(() => {
    sendNextQuestion(io, roomId);
  }, 5000);

  questionTimer.set(roomId, timerId);
}

function registerGameHandlers(io, socket) {
  socket.on("submit_answer", async ({ roomId, userId, answerIndex }) => {
    const state = gameStates.get(roomId);
    if (!state) return;

    const correct = answerIndex === state.answerIndex;
    console.log(`📥 ${userId} → ${roomId} 정답 제출: ${correct ? "⭕ 정답" : "❌ 오답"}`);

    if (correct) {
      // 중복 방지
      if (!state.correctUsers.includes(userId)) {
        state.correctUsers.push(userId); //  정답자 배열에 순서대로 추가

        // ✅ 점수 부여: 선착순 3등까지만
      const index = state.correctUsers.length - 1;
      if (index < 3) {
        const round = state.round;
        const pointTable = round === 5 ? [50, 30, 10] : [30, 20, 10];
        const points = pointTable[index];

        await gameScoreService.addScoreToUser(roomId, userId, points);
        const newScore = await gameScoreService.getUserScore(roomId, userId);

        // const prevScore = userScores.get(userId) || 0;
        // const newScore = prevScore + points;
        // userScores.set(userId, newScore);

        console.log(`🏅 ${userId}님에게 ${points}점 지급! (총점: ${newScore})`);

        // 클라이언트에게 실시간 점수 전송
        io.to(roomId).emit("score_updated", {
          userId,
          score: newScore,
        });
        }
      }
    }
  });

  // 게임 중간에 사용자 나감 + 1명만 남았을 경우 강제 종료
  socket.on("leave_room", async ({ roomId, userId }) => {
    console.log(`🚪 ${userId}님 ${roomId}에서 나감`);
    socket.leave(roomId);

    // DB에서 해당 유저 삭제
    await gameRoomUserService.leaveRoom(roomId, userId);

    // 최신 게임 방 정보 가져오기
    const roomInfo = await gameRoomService.getRoomInfo(roomId);
    const waitingPlayers = roomInfo.WAITING_PLAYER;
    const totalPlayers = roomInfo.TOTAL_PLAYER;
    const isActive = roomInfo.IS_ACTIVE;

    // ✅ 전체 사용자에게 방 상태 브로드캐스트
    io.emit("room_state_update", {
      roomId,
      waitingPlayer: waitingPlayers,
      totalPlayer: totalPlayers,
      isActive: isActive,
    });

    // ✅ 같은 방 내부 유저들에게 퇴장 알림
    io.to(roomId).emit("user_left", { userId });

    // ✅ 1명 이하 남으면 게임 종료
    if (waitingPlayers <= 1) {
      io.to(roomId).emit("game_forced_end", {
        message: "⚠️ 플레이어가 모두 나가 게임이 종료되었습니다.",
      });

      gameStates.delete(roomId);
      questionTimer.delete(roomId);
      console.log(`🛑 ${roomId} 게임 강제 종료됨`);
    }
  });
}

module.exports = {
  startGameRounds,
  registerGameHandlers,
};