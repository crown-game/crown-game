class GamePlayInterface {
    /**⏹️
     * 게임을 시작하는 메서드
     * - 게임이 시작되기 전에 20초 준비 시간을 가짐
     * - 준비 시간이 끝나면 문제를 출제하고 게임을 시작
     * @param {number} roomId - 게임이 시작될 방 ID
     */
    startGame(roomId) {
        throw new Error("Method not implemented.");
    }


    /**⏹️
     * 문제를 출제하는 메서드
     * - 문제는 30초 동안 제공됨
     * - 답안 제출은 선착순 3명까지 허용
     * @param {number} roomId - 문제를 출제할 방 ID
     * @param {string} question - 문제 내용
     * @param {Array} options - 답안 옵션 목록
     */
    issueQuestion(roomId, question, options) {
        throw new Error("Method not implemented.");
    }


    /**⏹️
     * 사용자가 제출한 답안을 처리하는 메서드
     * - 선착순 3명까지 답안을 제출할 수 있음
     * - 정답 맞추면 점수 부여, 틀리면 기회 제공
     * @param {number} userId - 답안을 제출한 사용자 ID
     * @param {number} roomId - 답안을 제출한 방 ID
     * @param {number} selectedAnswer - 사용자가 선택한 답안 번호 (1번, 2번, 3번 등)
     */
    submitAnswer(userId, roomId, selectedAnswer) {
        // 1. 정답을 가져옵니다.
        const correctAnswer = this.getCorrectAnswer(roomId);

        // 2. 답안을 비교하여 정답 여부 확인
        if (selectedAnswer === correctAnswer) {
            // 3. 정답인 경우 점수 부여
            this.awardPoints([userId]); // 배열로 감싸서 넘겨야 함
            
            // 4. 클라이언트에게 '정답' 통지 (실시간으로)
            this.notifyClient(userId, roomId, 'correct');
            
            // 5. 3명이 모두 정답을 맞춘 경우 다음 문제로 넘어감
            if (this.isThirdPersonAnswered(roomId)) {
                this.moveToNextQuestion(roomId);
            }
        } else {
            // 6. 틀린 경우 기회 제공 (틀린 사용자는 기회 넘어감)
            this.notifyClient(userId, roomId, 'incorrect');
            
            // 7. 다음 순번 사용자에게 기회 제공
            this.moveToNextUser(roomId);

             // 8. 틀린 사용자가 다시 제출할 수 있도록 순번이 밀린 사용자에게 기회 제공
            this.allowRetry(userId, roomId);
        }
    }


    
        /** ✅?????????
         * 틀린 사용자가 다시 제출할 수 있도록 순번을 밀어주는 메서드 
         * @param {number} userId - 틀린 사용자 ID
         * @param {number} roomId - 게임방 ID
         */
        allowRetry(userId, roomId) {
            // 틀린 사용자가 다시 제출할 수 있도록 순번을 밀어주는 로직 구현
            // 예: 대기 리스트나, 제출 대기 큐에서 다시 제출을 허용하는 로직
            // 실제 순번이 밀리는 방식은 이 부분에서 설정됩니다.
            this.moveUserToRetryList(userId, roomId); // 예시 메서드로, 재시도할 수 있도록 대기 리스트에 추가
        }





    /**⏹️
     * 사용자가 정답을 맞췄을 때 점수를 부여하는 메서드
     * - 점수는 30점, 20점, 10점으로 차등 부여
     * @param {Array} correctUsers - 정답을 맞춘 사용자들의 ID 배열
     */
        awardPoints(correctUsers) {
        // 예시: 첫 번째, 두 번째, 세 번째로 정답을 맞춘 사용자들에게 차등 점수 부여
        const points = [30, 20, 10]; // 차등 점수
        correctUsers.forEach((userId, index) => {
            const score = points[index];
            this.addScore(userId, score);
        });
    }

    
    
    

    /**⏹️
     * 문제를 순차적으로 진행하는 메서드
     * - DB에서 현재 라운드에 맞는 문제를 가져옵니다.
     * - 문제를 클라이언트에 제공하고, 문제를 넘어갈 준비를 합니다.
     * @param {number} roomId - 게임방 ID
     */
    moveToNextQuestion(roomId) {
        // 1. 현재 라운드 번호를 확인
        const currentRound = this.getCurrentRound(roomId);

        // 2. DB에서 해당 라운드 번호에 맞는 문제를 가져옵니다.
        const question = this.fetchQuestionForRound(roomId, currentRound);
        
        if (question) {
            // 3. 문제를 클라이언트에게 전달 (실시간으로 전달)
            this.issueQuestion(roomId, question.question, question.options);
            
            // 4. 다음 라운드로 넘어가기 전에 라운드 번호 증가
            this.incrementRound(roomId);
        } else {
            // 모든 문제가 끝났다면 게임 종료 처리
            this.endGame(roomId);
        }
    }
        /**
         * 게임방의 현재 라운드 번호를 가져오는 메서드
         * @param {number} roomId - 게임방 ID
         * @returns {number} - 현재 라운드 번호
         */
        getCurrentRound(roomId) {
            // DB에서 roomId에 맞는 현재 라운드 번호를 가져옵니다.
            // 예시: roomId에 맞는 라운드를 추적하는 로직
            return 1; // 예시로 1라운드
        }

        /**
         * 라운드 번호에 맞는 문제를 DB에서 가져오는 메서드
         * @param {number} roomId - 게임방 ID
         * @param {number} roundNumber - 라운드 번호
         * @returns {Object|null} - 문제 내용과 옵션이 포함된 객체, 없으면 null
         */
        fetchQuestionForRound(roomId, roundNumber) {
            // DB에서 문제를 가져오는 쿼리 실행 예시
            // 예시 쿼리: SELECT * FROM questions WHERE room_id = ? AND round_number = ? LIMIT 1
            // 예시 반환 값:
            return {
                question: "첫 번째 문제입니다. JavaScript는 어떤 언어인가요?",
                options: ["프로그래밍 언어", "마크업 언어", "스타일시트 언어", "그래픽 언어"]
            };
        }
        /**
         * 게임방의 라운드 번호를 자동으로 증가시키는 메서드
         * @param {number} roomId - 게임방 ID
         */
        incrementRound(roomId) {
            // DB에서 현재 라운드를 조회하여 증가시킴
            // 예시 쿼리: UPDATE game_rooms SET round_number = round_number + 1 WHERE room_id = ?;
            console.log(`Game room ${roomId} next round.`);
            // 실제 DB 업데이트 로직 예시 (쿼리 실행)
            // db.query("UPDATE game_rooms SET round_number = round_number + 1 WHERE room_id = ?", [roomId]);
        }






    /**⏹️
     * 틀린 답안을 제출한 사용자가 다음 기회를 가지도록 순서를 변경하는 메서드
     * - 틀린 답안 제출 후 해당 사용자가 기회를 얻고, 순서 변경
     * @param {number} roomId - 게임방 ID
     */
    moveToNextUser(roomId) {
        throw new Error("Method not implemented.");
    }


   /**⏹️
     * 게임을 종료하고 우승자를 결정하는 메서드
     * - 점수가 가장 높은 사용자에게 왕관을 부여
     * @param {number} roomId - 종료할 게임방 ID
     * @returns {number} winnerId - 우승자 사용자 ID
     */
    endGame(roomId) {
        // 1. 누적된 점수 리스트를 가져옵니다.
        const scores = this.getScores(roomId); // 예: { userId: score, ... }
        
        // 2. 가장 높은 점수를 가진 사용자 찾기
        let winnerId = null;
        let maxScore = -Infinity;
        for (const userId in scores) {
            if (scores[userId] > maxScore) {
                maxScore = scores[userId];
                winnerId = userId;
            }
        }
        
        // 3. 우승자에게 왕관 부여 (예: 점수 업데이트, 클라이언트에 알림 등)
        this.awardCrown(winnerId);
        
        // 4. 우승자 ID 반환
        return winnerId;
    }

    /**
     * 게임방의 누적 점수 리스트를 가져오는 메서드
     * @param {number} roomId - 게임방 ID
     * @returns {Object} - 사용자 ID와 점수의 객체 (예: { userId: score })
     */
    getScores(roomId) {
        // 예시: 각 사용자들의 점수를 반환하는 로직
        // 실제 데이터 구조에 맞게 수정 필요
        return {
            1: 150, // userId: score
            2: 120,
            3: 180,
            4: 110,
        };
    }

    /**
     * 우승자에게 왕관을 부여하는 메서드
     * @param {number} userId - 우승자 사용자 ID
     */
    awardCrown(userId) {
        // 우승자에게 왕관을 부여하는 로직
        console.log(` ${userId} 사용자 당신에게 왕관을 부여한다!`);
    }


    /**⏹️
     * 게임방에서 사용자가 나갈 때의 처리를 위한 메서드
     * - 게임을 중간에 나갈 때 해당 사용자의 기록은 저장되지 않음
     * @param {number} userId - 나가는 사용자 ID
     * @param {number} roomId - 나갈 방 ID
     */
    leaveGameRoom(userId, roomId) {
        throw new Error("Method not implemented.");
    }


    /**⏹️
     * 각 문제에 대한 제출 시간 초과 여부를 체크하는 메서드
     * - 30초가 지나면 제출 불가
     * @param {number} roomId - 게임방 ID
     * @returns {boolean} - 제출 시간이 초과되었으면 true, 아니면 false
     */
    isTimeExpired(roomId) {
        throw new Error("Method not implemented.");
    }


    /** ⏹️
     * 게임을 종료하고 게임방을 삭제하는 메서드
     * - 게임 종료 후 해당 게임방을 삭제
     * @param {number} roomId - 삭제할 게임방 ID
     */
    resetGame(roomId) {
        // 1. 게임방 삭제
        this.deleteGameRoom(roomId);

        // 2. 클라이언트에게 게임 종료 알림
        this.notifyClientsGameOver(roomId);
    }

    /**
     * 게임방을 삭제하는 메서드
     * @param {number} roomId - 게임방 ID
     */
    deleteGameRoom(roomId) {
        // 게임방을 삭제하는 로직 구현
        console.log(` ${roomId}방은 삭제되었다`);
    }

    /**
     * 게임이 종료되었음을 클라이언트에게 알리는 메서드
     * @param {number} roomId - 게임방 ID
     */
    notifyClientsGameOver(roomId) {
        // 클라이언트에게 게임 종료 및 방 삭제 알리기
        console.log(`게임은 종료되었다 ${roomId} 방은 사라진다`);
    }



}
