

class GameRoomInterface{

 /**
   * 게임방을 생성하는 메서드
    * @param {number} masterId - 방을 생성하는 사용자 ID (방장)
    * @param {Object} roomConfig - 방 설정 정보
    *   - {number} maxPlayers - 게임방 최대 인원 수
    * @returns {number} gameId - 생성된 게임방의 ID
    * @throws {Error} 메서드가 구현되지 않았을 경우 예외 발생
   */
    createGameRoom(masterId, roomConfig) {
        throw new Error("구현 no");
    }

 /**  ??????✅
   * 게임방의 최대 인원 수를 조회하는 메서드
   * @param {number} roomId - 조회할 방 ID
   * @returns {number} - 게임방의 최대 인원 수
   */
  getMaxPlayers(roomId) {
    throw new Error("Method not implemented.");
  }


     /**
     * 게임방에 현재 참가한 총 사용자 수 조회
     * @param {number} roomId
     * @param { number} currentPlayers 현재 게임방에 참가한 사용자 수
     * @return 현재 참가한 총 인원 수 반환
     * @throws {Error}
     */
    getCurrentPlayerCount(roomId) {
        throw new Error("no");
    }


    /**
     * 현재 게임방의 상태 조회
     * - 게임방이 "시작 중"인지 "대기 중"인지, 또는 다른 상태 정보를 조회
     * - 상태 정보는 방의 진행 여부, 대기 중인 인원 수 등으로 구성될 수 있음
     * 
     * @param {number} roomId - 조회할 방 ID
     * @returns {{
        *   roomId: number,
        *   status: "waiting" | "in_progress" | "ended",
        *   currentPlayers: number
        * }} 게임방의 현재 상태 정보
     * @throws {Error} 메서드가 구현되지 않았을 경우 예외 발생
     */
    getRoomStatus(roomId) {
        throw new Error("구현 no");

    }
    



    /**
     * 게임방에 입장할 수 있도록 하는 메서드
     * - 유저가 입장할 때마다 인원 수를 체크
     * - 조건이 충족되면 addUserToRoom() 호출
     * @param {number} roomId
     * @param {number} userId
     * @throws {Error} 게임방 존재하지 않으면
     */
        joinGameRoom(userId, roomId) {
            throw new Error("no")
            // 게임방 존재 확인 throw new Error("방이 존재하지 않음");
                // 1. getRoomStatus(roomId)로 방의 상태 확인
                //    - "waiting" 상태가 아니면 입장 불가 (예외 throw)

            
            //게임방이 대기중인지 확인 getRoomStatus() throw new Error("이미 게임이 시작됨");
            // 인원이 찾는지 확인 getCurrentPlayerCount() throw new Error("게임방 인원이 가득 찼습니다.");
                 
            
        }
        /**
         * 유저를 게임방에 추가하는 내부 메서드
         * 실제로 유저를 게임방에 추가하는 동작만 수행
         * @param {number} userId
         * @param {number} roomId
         * @throws {Error}
         */
        addUserToRoom(userId, roomId) {
            throw new Error("Method not implemented.");
        }
    

   

    /**
     * 게임방 나가기
     * -문제를 풀다가 나가도됨
     * @param {number} userId
     * @param {number} roomId
     * @throws {Error} 
     */
    leaveGameRoom(userId, roomId) {
        throw new Error("no");
    }
}