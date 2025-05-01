# 👑 CrownGame



> 실시간 퀴즈 게임 웹 애플리케이션  

> 여러 명이 같은 방에서 실시간으로 퀴즈를 풀고, 점수를 획득하며 최종 우승자를 가리는 웹 기반 멀티플레이 게임입니다.



---



## 📌 주요 기능



- 사용자 회원가입 / 로그인

- 게임방 생성 및 입장 (최대 6인)

- 5라운드 퀴즈 출제 (객관식, 오지선다)

- 선착순 3명 정답 제출 → 차등 점수 지급

- 비속어 사용 시 패널티

- 게임 종료 후 우승자에게 👑 왕관 부여

- 실시간 소켓 통신 기반 게임 동기화



---





## ⚙️ 기술 스택



### 프론트엔드

- React

- Socket.IO-client

- HTML, CSS, JavaScript



### 백엔드

- Node.js + Express

- Socket.IO

- MySQL 



---



## 🚀 실행 방법



1. 백엔드

```bash

$ cd /path/to/your/backend



(package.json이 없으면 $ npm init -y   # package.json 자동 생성)



$ npm install 



$ npm install express cors socket.io   # 필요한 패키지 설치



$ node index.js

```



2. 프론트

```bash

$ cd /path/to/your/frontend



$ npm install



$ npm start

```

---

혹시 cors설정할 때 작동 안되면 프론트 주소 직접 작성해야합니다



--

## 깃 사용법

### github 레포지터리 클론

```bash

$ git clone https://github.com/your-repo-url.git

```



### Git 브랜치 확인 및 체크아웃

#### 현재 브랜치 확인 및 브랜치 최신화

```bash

$ git branch



# develop 브랜치 최신화

$ git checkout develop

$ git pull origin develop



```

#### 다른 브랜치 생성 및 이동

```bash

$ git checkout feature/해당 기능   # 새로운 브랜치에서 작업 시작하려면, 해당 브랜치로 체크아웃



$ git checkout -b feature/새로운 기능   # 브랜치를 새로 만들면서 이동

```



### 기능 개발 완료 후 (깃에 올리고 싶으면)

#### 변경 사항 추가

```bash

$ git add .    # 모든 변경 파일 추가



$ git add <file_name>   # 특정 파일만 추가

```



#### 커밋

```bash

$ git commit -m "작업한 내용에 대한 설명"   # 커밋 메세지 작성

```



### 원격 레포지터리와 동기화

#### 원격 레포지터리로 푸시

```bash

$ git push origin feature/기능    # 해당 브랜치 푸시

```

---

#### 최신 상태로 가져오기(pull)

```bash

$ git pull origin 브랜치명    # 브랜치의 최신 내용 가져오기

```



## 브랜치 병합

Pull Request(PR) : 새로운 기능을 개발한 후, 해당 브랜치를 다른 브랜치에 병합하려면 pull Request를 생성한다 (new pull request를 눌러 병합 요청 생성)



#### 로컬에서 병합하기

: pr을 통해서 병합 요청할 때, 로컬에서 병합 작업을 먼저 테스트 할 수 있다

```bash

$ git checkout 브랜치(a)      # 브랜치(a) 이동



$ git pull origin 브랜치(a)     #최신 상태로 브랜치(a) 업데이트



$ git merge 기능브랜치/해당브랜치      #'기능브랜치/해당브랜치' 브랜치를 브랜치(a)에 병합





**병합 충돌이 발생하면 수동으로 해결하고, 병합 후 git commit을 사용하여 병합 커밋을 추가합니다.(충돌 발생 공유)



### 병합 후 푸시

```bash

$ git bash origin develop    #병합된 브랜치(a) 푸시

```



## 충돌 해결

병합 시 충돌 발생하면, 충돌 발생 파일을 열어 수정해야합니다!! 해당 파일이 자신이 구현한 코드가 아니라면 해당 코드 개발자에게 요청해주세요

수정후엔 git add <파일>로 변경하고, 커밋한 후 푸시합니다



### 작업 끝

작업이 끝나면 브랜치를 삭제할 수 있습니다. 단, 확실치 않으면 팀원과 공유해주세요



## ✅ 주의 사항

- develop 브랜치가 최종 기능을 합치는 브랜치입니다. main 브랜치는 배포용

- 작업이 끝난 후엔 pull request를 통해 다른 팀원들에게 코드 리뷰 받으면 병합 됩니다

- 항상 주기적으로 develop 브랜치를 pull 받아서 현재 브랜치에 반영하면 충돌을 최소화 할 수 있습니다@!!



---

만약,기능 개발 중 develop 브랜치가 변경된 경우

 

 ```bash

# 1. develop 브랜치로 이동해서 최신 내용 받기

git checkout develop

git pull origin develop



# 2. 다시 내가 작업하던 브랜치로 이동

git checkout feat/my-feature



# 3. develop 브랜치를 merge (병합)함

git merge develop

```



---

### 깃 브랜치 구조 (예시)

```bash

main                     ← 최종 배포 브랜치

 │

 └── develop             ← 모든 기능이 병합되는 통합 개발 브랜치

       ├── feat/login       ← 로그인 기능 개발

       ├── feat/signup      ← 회원가입 기능 개발

       ├── feat/chat        ← 채팅 기능 개발

       └── feat/game-room   ← 게임방 기능 개발

```

