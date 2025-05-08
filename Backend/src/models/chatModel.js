const db = require("../config/db");

const getForbiddenWords = async () => {
  const [rows] = await db.query("SELECT forbid_text FROM forbidden_word");
  return rows.map(row => row.forbid_text);
};

//금지어 채팅 시 점수 차감 로직 구현
const deducScore = async(userId, game_score = 10) => {
  await db.query("update user set score = score - ? where userId = ?",[game_score , userId]);
};

module.exports = {
  getForbiddenWords,
  deducScore
};
