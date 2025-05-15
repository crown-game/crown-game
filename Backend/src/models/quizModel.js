const db = require("../config/db");

const getQuestionsByRound = async (round) => {
  const [rows] = await db.query(`
    SELECT * 
    FROM (
        SELECT * 
        FROM QUIZ
        WHERE ROUND = ?
        ORDER BY RAND()
        LIMIT 25
    ) AS random_quiz
    JOIN QUIZ_OPTION USING (QID)
  `, [round]);
  return rows;
};

module.exports = {
    getQuestionsByRound
};