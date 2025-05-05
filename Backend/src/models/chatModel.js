const db = require("../config/db");

const getForbiddenWords = async () => {
  const [rows] = await db.query("SELECT forbid_text FROM forbidden_word");
  return rows.map(row => row.forbid_text);
};

module.exports = {
  getForbiddenWords,
};
