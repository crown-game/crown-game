const chatModel = require("../models/chatModel");

const checkForbidden = async (message) => {
  const forbiddenWords = await chatModel.getForbiddenWords();
  return forbiddenWords.some(word => message.includes(word));
};

module.exports = {
  checkForbidden,
};
