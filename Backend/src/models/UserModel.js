
class Users {
    constructor(userId, userName, password, profileImg, crownCnt = 0) {
      this.userId = userId;
      this.userName = userName;
      this.password = password;
      this.profileImg = profileImg;
      this.crownCnt = crownCnt;
    }
  }
  
  module.exports = Users;
  