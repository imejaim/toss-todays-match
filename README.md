# 오늘의 짝꿍 (TodayMatch)

토스 인앱 미니앱(WebView)으로 개발하는 **연애 운세 서비스**입니다.  
토스 앱 안에서 간단한 프로필을 입력하고, 오늘의 연애 운세와 심층 리포트(예정)를 확인할 수 있습니다.

> **목표**: 최소 기능(MVP)으로 빠르게 런칭하고, 실제 사용자 반응/데이터를 기반으로 고도화하는 것.

---

## 1. 기능 개요 (v1 스코프)

### 1.1 화면 구성

1. **Home – 오늘의 짝궁**
   - 타이틀/설명 문구
   - `오늘 운세 보기` 버튼 (TDS Button)
   - `연애 프로필 설정` 버튼 (TDS Button)

2. **Profile – 연애 프로필 설정**
   - 닉네임, 생년월일, 성별, 연애 상태 입력
   - (v1 기준: 단순 폼 + 최소 유효성 검사)

3. **TodayFortune – 오늘의 연애 운세**
   - 점수 (60–100점)
   - 키워드 태그 (고백운, 소개팅운, 대화운 등)
   - 한 줄 요약 메시지
   - `심층 리포트 보기`, `홈으로` 버튼

4. **PremiumReport – 심층 리포트(예정)**
   - 연애 성향/패턴/잘 맞는 스타일 등 목차 형태
   - 오늘 운세 기반 텍스트 (데모 버전)
   - *추후 유료 리포트/인앱결제 연동 예정*

---

## 2. 기술 스택

- **프론트엔드**: React 18, TypeScript, Vite, Apps-in-Toss Web Framework (Granite)
- **UI 라이브러리**: TDS Mobile (`@toss/tds-mobile`)
- **런타임**: 토스 인앱 WebView
- **테스트 환경**: 앱인토스 샌드박스 (Android)

---

## 3. 시작하기 (Getting Started)

### 3.1 설치 및 로컬 서버 실행

```bash
# 프로젝트 디렉토리로 이동
cd C:\Project\2_TossInApp\todays-match-web

# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
# -> http://localhost:5173 접속 가능
```

### 3.2 안드로이드 샌드박스 설정 (Windows)

1. **개발자 옵션 활성화**: 설정 → 휴대폰 정보 → 빌드 번호 7회 탭 → 개발자 모드 ON
2. **USB 디버깅 활성화**: 설정 → 개발자 옵션 → USB 디버깅 ON
3. **PC 연결**: USB 케이블 연결 (파일 전송 모드 권장)
4. **포트 포워딩 (adb)**:

```bash
# adb가 있는 경로로 이동 (예시)
cd C:\Android\platform-tools

# 기기 연결 확인
adb devices

# 포트 매핑 (Granite 서버 및 번들러)
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
```

---

## 4. 빌드 및 배포 (Build & Deploy)

### 4.1 빌드 (Production Build)

배포 전에 코드를 프로덕션용으로 빌드하여 오류가 없는지 확인합니다.

```bash
npm run build
# 내부적으로 'granite build' 실행
# 'dist' 폴더 생성됨
```

### 4.2 배포 (Deploy to Apps-in-Toss)

앱인토스 콘솔에 빌드된 결과물을 업로드하고 배포합니다.

```bash
npm run deploy
# 또는
ait deploy
```

> **Note**: 배포 권한이 필요하며, `ait login`이 선행되어야 할 수 있습니다.

---

## 5. 프로젝트 구조

```text
todays-match-web/
├── src/
│   ├── pages/          # 페이지 컴포넌트 (Home, Profile, TodayFortune...)
│   ├── components/     # 재사용 컴포넌트 (Layout 등)
│   ├── utils/          # 운세 로직 등 유틸리티
│   ├── App.tsx         # 메인 라우팅
│   └── main.tsx        # 진입점 (Provider 설정)
├── public/             # 정적 리소스
├── granite.config.ts   # Granite 설정
├── vite.config.ts      # Vite 설정
└── package.json
```

---

## 6. 참고 링크

- [앱인토스 개발자 콘솔](https://apps-in-toss.toss.im/)
- [앱인토스 가이드](https://developers-apps-in-toss.toss.im/)
- [TDS Mobile 문서](https://tossmini-docs.toss.im/tds-mobile/start/)
- [GitHub Repository](https://github.com/imejaim/toss-todays-match)

