const db = require('../config/AuthDB');
const Users = require('../models/UserModel');

const registerUser = async(userName , password, profile_Img)=> {
       // 값이 undefined이면 null로 처리
       if(!userName || !password) throw new Error('필수 정보 누락');
 
        const [exist] = await db.execute('SELECT * FROM Users WHERE userName = ?', [userName]);
        if (exist.length > 0) {
          throw new Error('이미 존재하는 사용자 이름입니다.');
        }

        const [result] = await db.execute(
            'INSERT INTO Users (userName, password, profile_Img) VALUES (?, ?, ?)',
            [userName, password, profile_Img]
          );

        return new Users(result.insertId, userName , password, profile_Img);
};
module.exports = { registerUser};