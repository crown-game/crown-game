const db = require('../config/db');
const Users = require('../models/UserModel');
const bcrypt = require('bcrypt'); //npm install bcrypt 하기!!!!

//회원가입 service 구현현
const registerUser = async(userName , password, profile_Img)=> {
       // 값이 undefined이면 null로 처리
       if(!userName || !password) throw new Error('필수 정보 누락');
 
        const [exist] = await db.execute('SELECT * FROM Users WHERE userName = ?', [userName]);
        if (exist.length > 0) {
          throw new Error('이미 존재하는 사용자 이름입니다.');
        }

        // 비밀번호 암호화 처리 -> bcrypt 사용
        const hashPassword = await bcrypt.hash(password,10);
        const [result] = await db.execute(
            'INSERT INTO Users (userName , password, profile_Img) values(?,?,?)',
            [userName , hashPassword , profile_Img]
        );

        return new Users(result.insertId, userName , hashPassword, profile_Img,0);
};


//로그인 service 구현 
// db에서 사용자 조회 후 비밀번호 비교
const loginUser = async (userName, password) => {
   
    // db에서 사용자 조회 후 비밀번호 비교하기 
    // 사용자 이름 추출
    const [name] = await db.execute(
        `SELECT UID AS userId, USERNAME AS userName, PASSWORD AS password, PROFILE_IMG AS profile_Img, CROWN_CNT AS crownCnt 
         FROM Users 
         WHERE USERNAME = ?`,
        [userName]
      );
      

    if (name.length === 0) {
        throw new Error('존재하지 않는 사용자입니다.');
    }

    const user = name[0];

    const isCorrect = await bcrypt.compare(password, user.password);  // 소문자 password로 비교
    if (!isCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }

    return new Users(user.userId, user.userName, user.password, user.profile_Img, user.crownCnt);
};

module.exports = {
    registerUser,
    loginUser
};