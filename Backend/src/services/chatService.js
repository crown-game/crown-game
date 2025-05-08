const chatModel = require("../models/chatModel");

const checkForbidden = async (message) => {
  const forbiddenWords = await chatModel.getForbiddenWords();
  return forbiddenWords.some(word => message.includes(word));
};

// 패널티에 따른 점수 차감 로직 구현
const penalizeUser = async ( userId) => {
  await chatModel.deducScore(userId);
}
module.exports = {
  checkForbidden,
  penalizeUser
};
