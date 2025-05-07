const jwt = require('jsonwebtoken'); // npm install jsonwebtoken하기!!

const authToken = (req , res, next) => {
    // Authorization 헤더에서 토큰을 가져옵니다.
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: '토큰이 없습니다.' });
  }

  // 토큰 검증
  jwt.verify(token, 'mySecretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 토큰이 유효하면, 토큰에서 사용자 정보를 req.user로 저장합니다.
    req.user = decoded;
    next();
  });
};

module.exports = authToken;