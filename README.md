# 오늘의 짝궁 (TodayMatch)

토스 인앱 미니앱(WebView)으로 개발하는 **연애 운세 서비스**입니다.  
토스 앱 안에서 간단한 프로필을 입력하고, 오늘의 연애 운세와 심층 리포트(예정)를 확인할 수 있습니다.

> 목표: **최소 기능(MVP)으로 빠르게 런칭**하고,  
> 실제 사용자 반응/데이터를 기반으로 고도화하는 것.

---

## 1. 기능 개요 (v1 스코프)

### 1.1 화면 구성

1. **Home – 오늘의 짝궁**
   - 타이틀/설명 문구
   - `오늘 운세 보기` 버튼 (TDS Button)
   - `연애 프로필 설정` 버튼 (TDS Button)

2. **Profile – 연애 프로필 설정**
   - 닉네임
   - 생년월일
   - 성별
   - 연애 상태
   - (v1 기준: 단순 폼 + 최소 유효성 검사)

3. **TodayFortune – 오늘의 연애 운세**
   - 점수 (예: 60–100점)
   - 키워드 태그 (고백운, 소개팅운, 대화운 등)
   - 한 줄 요약 메시지
   - `심층 리포트 보기`, `홈으로` 버튼

4. **PremiumReport – 심층 리포트(예정)**
   - 연애 성향/패턴/잘 맞는 스타일 등 목차 형태
   - 오늘 운세 기반 텍스트 몇 단락
   - 현재는 **데모/티저 화면**, 추후 유료 리포트/인앱결제 연동 예정

---

## 2. 기술 스택

- **프론트엔드**
  - React 18 + TypeScript
  - Vite
  - Apps-in-Toss Web Framework (Granite)
  - TDS Mobile (`@toss/tds-mobile`, `@toss/tds-mobile-ait`)
- **런타임**
  - 토스 인앱 WebView
  - 앱인토스 샌드박스(안드로이드)로 개발/테스트

프로젝트 루트 예시:

```text
C:\Project\2_TossInApp\todays-match-web


## Quick Reference – 개발/테스트 치트시트

### 1. 주요 링크

- 앱인토스 개발자 콘솔:  
  - 워크스페이스 & 미니앱 관리  
  - https://apps-in-toss.toss.im/
- 앱인토스 WebView 개발 가이드:  
  - https://developers-apps-in-toss.toss.im/development/overview.html
- TDS Mobile 시작 문서:  
  - https://tossmini-docs.toss.im/tds-mobile/start/
- 샌드박스 테스트 가이드:  
  - https://developers-apps-in-toss.toss.im/development/test/sandbox.html
- GitHub 레포지토리 (코드 & 문서):  
  - https://github.com/imejaim/toss-todays-match

---

### 2. 로컬 개발 기본 명령어

프로젝트 루트:

```bash
cd C:\Project\2_TossInApp\todays-match-web

### 3. 안드로이드 폰 설정 (USB 디버깅)

휴대폰 개발자 옵션 활성화

설정 → 휴대폰 정보 → 빌드 번호 여러 번 탭 → 개발자 모드 ON

설정 → 개발자 옵션 → USB 디버깅 ON

USB 케이블로 PC 연결 (가능하면 데이터 전송 모드)

처음 연결 시 폰에 뜨는
“이 컴퓨터를 신뢰할까요?” / “RSA 키 허용” 팝업 → 허용

### 4. adb + 샌드박스 연결 순서
cd C:\Project\2_TossInApp\todays-match-web
npm run dev

PC에서 adb reverse 설정

cd C:\Android\platform-tools

# 기기 연결 확인
adb devices      # -> "XXXX    device" 가 보여야 정상

# 포트 매핑
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173

# 확인
adb reverse --list
# tcp:8081 tcp:8081
# tcp:5173 tcp:5173

cd C:\Project\2_TossInApp\todays-match-web

### 5. GitHub 사용 루틴
git status                # 어떤 파일이 바뀌었는지 확인
git add <변경된_파일들>   # 예: src/App.tsx src/... 등
git commit -m "메시지"
git push

