const AuthService = require('../services/AuthServices');

///회원 가입 controller 구현현
const registerUser = async (req, res) => {
    const { userName, password } = req.body;
    const profile_Img = req.file
      ? `/uploads/profile/${req.file.filename}`
      : `/uploads/profile/default_profile/profile.png`;
  
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
const loginUser = async (req, res) => {
    console.log('[로그인 요청] req.body:', req.body);
  
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }
  
    try {
      const user = await AuthService.loginUser(userName, password);
      res.status(200).json({
        message: '로그인 성공',
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
  
  module.exports = {
    registerUser,
    loginUser
  };