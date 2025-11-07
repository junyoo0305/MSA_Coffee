# MSA 프로젝트 프론트엔드

이 프로젝트는 MSA(Microservice Architecture) 프로젝트의 프론트엔드 부분입니다. Vue.js를 사용하여 구현되었습니다.

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### Node.js 설치
1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 프로그램 실행
3. 설치 완료 후 터미널에서 다음 명령어로 설치 확인:
```bash
node --version
npm --version
```

### Vue.js 개발 도구 설치
1. Vue DevTools 설치
   - [Chrome Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
   - [Firefox Vue DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

2. VS Code 확장 프로그램 설치 (권장)
   - Volar (Vue 3 지원)
   - TypeScript Vue Plugin
   - ESLint
   - Prettier

## 프로젝트 설정

### 1. 프로젝트 클론
```bash
git clone [프로젝트 URL]
cd gateway-ui
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 다음 내용 추가:
```env
VITE_API_URL=http://localhost:8080
```

## Vue.js 화면 보기

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 접속
- 기본 URL: http://localhost:5173
- 또는 터미널에 표시된 URL로 접속

### 3. 주요 화면
- 메인 페이지: http://localhost:5173/
- 로그인: http://localhost:5173/login
- 회원가입: http://localhost:5173/register
- 상품 관리: http://localhost:5173/products
- 주문 관리: http://localhost:5173/orders
- 게시판: http://localhost:5173/board
- 관리자 페이지: http://localhost:5173/admin

### 4. 개발자 도구 사용
- F12 또는 Ctrl+Shift+I: 브라우저 개발자 도구 열기
- Vue DevTools 탭에서 컴포넌트 구조 확인
- Network 탭에서 API 요청 모니터링

### 5. 모바일 화면 테스트
- 개발자 도구의 디바이스 툴바 사용 (Ctrl+Shift+M)
- 다양한 디바이스 크기로 테스트 가능

## 개발 서버 실행

### 개발 모드
```bash
npm run dev
```
- 개발 서버가 http://localhost:5173 에서 실행됩니다
- Hot Module Replacement (HMR) 지원
- 실시간 코드 변경 감지

### 프로덕션 빌드
```bash
# 프로덕션용 빌드 생성
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 프로젝트 재실행

### 1. 개발 서버 중지 후 재시작
```bash
# Ctrl + C로 현재 실행 중인 서버 중지
# 그 후 다시 실행
npm run dev
```

### 2. 캐시 초기화 후 재시작
```bash
# node_modules 삭제
rm -rf node_modules
# package-lock.json 삭제
rm package-lock.json
# 의존성 재설치
npm install
# 개발 서버 실행
npm run dev
```

### 3. 포트 변경하여 실행
```bash
# 3000번 포트로 실행
npm run dev -- --port 3000
```

### 4. 호스트 설정하여 실행
```bash
# 모든 네트워크 인터페이스에서 접근 가능하도록 실행
npm run dev -- --host
```

## 주요 기능

### 1. 인증 시스템
- 로그인/회원가입
- JWT 기반 인증
- 권한 기반 접근 제어 (USER/ADMIN)

### 2. 상품 관리
- 상품 목록 조회
- 상품 추가/수정/삭제
- 상품 상세 정보 관리

### 3. 주문 관리
- 주문 목록 조회
- 주문 추가/수정/삭제
- 주문 상태 관리

### 4. 게시판
- 게시글 목록 조회 (페이지네이션)
- 게시글 작성/수정/삭제
- 댓글 기능

### 5. 관리자 기능
- 사용자 관리
- 권한 관리
- 시스템 모니터링

## 기술 스택

- Vue.js 3
- TypeScript
- Vue Router
- Pinia (상태 관리)
- Axios (HTTP 클라이언트)
- Bootstrap 5
- Vite (빌드 도구)

## 프로젝트 구조

```
gateway-ui/
├── src/
│   ├── assets/          # 정적 리소스
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── router/          # 라우터 설정
│   ├── stores/          # Pinia 스토어
│   ├── views/           # 페이지 컴포넌트
│   ├── App.vue          # 루트 컴포넌트
│   └── main.ts          # 앱 진입점
├── public/              # 정적 파일
└── package.json         # 프로젝트 설정
```

## API 엔드포인트

### 인증
- POST /api/auth/login - 로그인
- POST /api/auth/register - 회원가입

### 상품
- GET /api/products - 상품 목록 조회
- POST /api/products - 상품 추가
- PUT /api/products/:id - 상품 수정
- DELETE /api/products/:id - 상품 삭제

### 주문
- GET /api/orders - 주문 목록 조회
- POST /api/orders - 주문 추가
- PUT /api/orders/:id - 주문 수정
- DELETE /api/orders/:id - 주문 삭제

### 게시판
- GET /api/posts - 게시글 목록 조회
- POST /api/posts - 게시글 작성
- PUT /api/posts/:id - 게시글 수정
- DELETE /api/posts/:id - 게시글 삭제
- GET /api/posts/:id/comments - 댓글 목록 조회
- POST /api/posts/:id/comments - 댓글 작성
- DELETE /api/posts/:id/comments/:commentId - 댓글 삭제

### 사용자 관리
- GET /api/users - 사용자 목록 조회
- PUT /api/users/:id - 사용자 정보 수정
- DELETE /api/users/:id - 사용자 삭제

## 환경 설정

프로젝트는 다음 환경 변수를 사용합니다:

- VITE_API_URL: API 서버 URL (기본값: http://localhost:8080)

## 문제 해결

### 1. 의존성 설치 오류
```bash
# node_modules 삭제
rm -rf node_modules
# package-lock.json 삭제
rm package-lock.json
# 의존성 재설치
npm install
```

### 2. 개발 서버 실행 오류
- 포트 충돌 시 다른 포트 사용:
```bash
npm run dev -- --port 3000
```

### 3. 빌드 오류
```bash
# 캐시 삭제 후 재빌드
npm run clean
npm run build
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
