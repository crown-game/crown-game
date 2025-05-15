
const mysql = require('mysql2');  // mysql 플로그인 호출

const pool = mysql.createPool({
  host: 'localhost',
  user: 'hippo',
  password: 'hippo7621^^', // 실제 비밀번호로 변경
  database: 'crown_hunt'
});

module.exports = pool.promise();  // DB 연결 객체를 promise 기반으로 내보내겠다.