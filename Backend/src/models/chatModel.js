const db = require("../config/db");

const getForbiddenWords = async () => {
  const [rows] = await db.query("SELECT forbid_text FROM forbidden_word");
  return rows.map(row => row.forbid_text);
};

//금지어 채팅 시 점수 차감 로직 구현
const deducScore = async(userId) => {
  await db.query("update game_room_user set game_score = game_score - 10 where uId = ?",[userId]);
};

module.exports = {
  getForbiddenWords,
  deducScore
};
