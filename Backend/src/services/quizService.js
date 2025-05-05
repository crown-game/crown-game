const quizModel = require("../models/quizModel");

exports.buildQuestions = async (round) => {
  const rows = await quizModel.getQuestionsByRound(round);
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

  return Array.from(questionsMap.values());
};
