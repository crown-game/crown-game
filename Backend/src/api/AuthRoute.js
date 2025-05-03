//npm install multer 설치 
//// 회원가입 부분
const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');
const multer = require('multer');
const path = require('path');

// Multer 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/profile');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 파일 필터링
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("허용되지 않는 파일 형식입니다"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 } // 10MB
});

//  회원가입 라우트 
router.post('/register', upload.single('profile_Img'), AuthController.registerUser);

// 로그인 라우트
router.post('/login', AuthController.loginUser);

module.exports = router;
