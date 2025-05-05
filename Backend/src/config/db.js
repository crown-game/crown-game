// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'Test',
  password: '1234',
  database: 'CROWN_HUNT'
});

module.exports = db;
