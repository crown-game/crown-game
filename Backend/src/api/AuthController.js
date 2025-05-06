const AuthService = require('../services/AuthServices');
const jwt = require('jsonwebtoken');

///회원 가입 controller 구현현
const registerUser = async (req, res) => {
    const { userName, password } = req.body;
    const profile_Img = req.file
      ? `/uploads/profile/${req.file.filename}`
      : `/uploads/default_profile/profile.png`;
  
    try {
      const newUser = await AuthService.registerUser(userName, password, profile_Img);
      res.status(201).json({
        message: '회원가입 성공',
        user: newUser,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };



// 로그인 controller 구현 
const loginUser = async (req , res )=> {
  
    const { userName, password } = req.body;
    try {
      const user = await AuthService.loginUser(userName, password);

   
      if (!user) {
        return res.status(400).json({ message: '잘못된 사용자 이름 또는 비밀번호' });
      }
  
      // JWT 토큰 생성하기 
      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.userName,
        },
        'mySecretKey',  // 하드코딩된 비밀키!!
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: '로그인 성공',
        token,  // -> 프론트에서 이 토큰을 저장하고 요청 시 사용
        user: {
          userId: user.userId,
          userName: user.userName,
          profile_Img: user.profile_Img,
          crownCnt: user.crownCnt,
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  /////////////////////////
  //로그아웃 구현 !!!
  const logoutUser = async (req, res) => {
    try{
      // 클라이언트에서 토큰을 제거하면 로그아웃 처리됨 
      res.status(200).json({message : '로그아웃 성공'});

    }catch (err) {
      res.status(500).json({message : '로그아웃 실패', error : err.message});
    }
  };
  
  module.exports = {
    registerUser,
    loginUser,
    logoutUser
  };