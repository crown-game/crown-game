// 접속자 목록 서비스
const connectedUsers = new Map();

const addConnectedUser = (userId, userData) => {
  connectedUsers.set(userId, userData);
};

const removeConnectedUser = (userId) => {
  connectedUsers.delete(userId);
};

const getConnectedUsers = () => {
  return connectedUsers;
};

module.exports = {
  addConnectedUser,
  removeConnectedUser,
  getConnectedUsers,
};
