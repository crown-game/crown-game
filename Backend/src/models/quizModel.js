const db = require("../config/db");

const getQuestionsByRound = async (round) => {
  const [rows] = await db.query(`
    SELECT * 
    FROM QUIZ
    JOIN QUIZ_OPTION USING (QID)
    WHERE ROUND = ?
    ORDER BY QID
    LIMIT 25
  `, [round]);
  return rows;
};

module.exports = {
    getQuestionsByRound
};