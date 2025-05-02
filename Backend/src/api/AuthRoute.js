//npm install multer 설치 
const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');
const multer = require('multer');
const path = require('path');

// multer 저장 설정
// 파일을 저장할 디렉토리 설정정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/profile')// 프로필 이미지 저장 폴더
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // 예: 1714634779384.png
    },
  });

//이미지 파일 확인 
//fileFilter -> 어떤 파일 허용할 것인지 결정
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("허용되지 않는 파일 형식입니다");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
      fileSize: 10000000, // 파일 사이즈 10MB로 제한
    },
  });

// 업로드 포함한 회원가입 라우트
router.post('/register', upload.single('profile_Img'), AuthController.registerUser);

module.exports = router;
