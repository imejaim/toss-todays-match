# 오늘의 짝꿍 – Fast Launch Plan

## 0. 프로젝트 개요

- 앱 이름: 오늘의 짝꿍 (Today's Match)
- 타깃: 토스 인앱을 사용하는 20~40대 성인 사용자
- 목표:
  - 최소 기능(MVP)으로 **빠르게 런칭**
  - 실제 사용 데이터와 피드백 확보 후, 고도화/유료화 단계로 확장

---

## 1. 현재 상태 요약

- [x] Apps-in-Toss 워크스페이스 생성 및 미니앱 등록
- [x] WebView 프로젝트 생성 (Vite + React + TS)
- [x] Granite 설정 완료 (`granite.config.ts`)
- [x] 샌드박스 + adb reverse 연동 확인
- [x] 기본 화면 플로우 구현
  - Home → Profile → TodayFortune → PremiumReport
- [x] React 18 + TDS 의존성 정리
- [x] TDSMobileAITProvider 적용 (`src/main.tsx`)
- [x] Home 화면 버튼을 TDS Button으로 교체
- [x] GitHub 연동 및 기준 커밋 생성

**현재 상태:**  
> 샌드박스에서 TDS Button이 적용된 Home 화면까지 정상 동작.  
> v1 출시를 위한 “화면/기능 최소 스코프” 정리 단계.

---

## 2. v1 기능 스코프

### 2.1 필수 화면

1. **Home**
   - [x] 제목/설명 문구
   - [x] “오늘 운세 보기” 버튼 (TDS)
   - [x] “연애 프로필 설정” 버튼 (TDS)
   - [ ] 문구 다듬기 (실사용자 관점 카피 정리)

2. **Profile**
   - [ ] 닉네임 입력 (TDS TextField or 기본 input)
   - [ ] 생년월일 입력 (date picker 또는 텍스트)
   - [ ] 성별 선택 (남/여/선택 안 함)
   - [ ] 연애 상태 선택 (솔로/연애중/기혼/복잡 미묘)
   - [ ] “저장하고 운세 보러가기” 버튼
   - [ ] 최소 유효성 검사 (예: 닉네임 비어 있을 때 안내)

3. **TodayFortune**
   - [ ] 점수(예: 60~100점)
   - [ ] 키워드 태그 (예: 고백운, 소개팅운, 대화운 등)
   - [ ] 짧은 메시지 (3단계 정도의 패턴)
   - [ ] “심층 리포트 보기”, “홈으로” 버튼

4. **PremiumReport**
   - [ ] 심층 리포트 목차(예: 연애 성향, 갈등 패턴, 잘 맞는 스타일 등)
   - [ ] 오늘 운세 기반 텍스트 한 단락
   - [ ] “현재는 데모 버전, 나중에 유료 리포트 예정” 안내
   - [ ] “오늘 운세로 돌아가기” 버튼

---

## 3. 개발 To-do (Fast Launch 기준)

### 3.1 UI / 로직

- [ ] Home / Profile / TodayFortune / PremiumReport **문구 1차 정리**
- [ ] Profile 입력값을 TodayFortune / PremiumReport 로 전달하는 데이터 흐름 최종 점검
- [ ] 운세 로직 1차 정리
  - [ ] 생년월일 + 연애 상태를 반영하는 간단한 규칙 설계
  - [ ] 점수 범위/키워드/메시지 조합을 “이상하지 않게” 정리
- [ ] 에러/예외 처리
  - [ ] 프로필 미입력 상태에서 바로 “오늘 운세 보기” 시 안내 문구 처리
  - [ ] 날짜 형식 이상할 때 처리(간단 경고만)

### 3.2 TDS 최소 적용

- [x] Home 버튼 TDS 적용
- [ ] Profile 폼에 TDS 컴포넌트 일부 적용 (필수 아니라면 v1 이후로 미뤄도 됨)
- [ ] TodayFortune 카드 레이아웃을 TDS 느낌으로 가볍게 정리 (선택)

### 3.3 배포 준비

- [x] README에 **빌드/배포 절차** 추가
  - [x] `npm run build`
  - [x] `ait deploy` (실제 명령 확인)
- [ ] 샌드박스에서 최종 QA
  - [ ] 기본 플로우 (Home → Profile → Today → Premium)
  - [ ] 프로필 미입력 / 입력 후 플로우
- [ ] 앱인토스 검수 체크 항목 확인
- [ ] 실제 검수 요청 및 결과 대응

---

## 4. 작업 히스토리 / 상태 메모

> 간단하게 “지금 어디까지 했는지” 적어두는 섹션.

- 2025-12-03
  - React 18 + TDS 의존성 정리
  - TDS Button Home 적용
  - 샌드박스에서 UI/동작 확인
  - GitHub에 기준 커밋 생성: `feat: integrate TDS Button on Home with React 18`

---

## 5. 다음에 재개할 때 체크리스트

1. **환경 재가동**
   - [ ] `cd C:\Project\2_TossInApp\todays-match-web`
   - [ ] `npm install` (필요 시)
   - [ ] `npm run dev`
   - [ ] 브라우저 `http://localhost:5173` 열어 플로우 확인

2. **샌드박스에서 확인이 필요하면**
   - [ ] `cd C:\Android\platform-tools`
   - [ ] `adb devices` (device 확인)
   - [ ] `adb reverse tcp:8081 tcp:8081`
1.  **환경 재가동**
    - [ ] `cd C:\Project\2_TossInApp\todays-match-web`
    - [ ] `npm install` (필요 시)
    - [ ] `npm run dev`
    - [ ] 브라우저 `http://localhost:5173` 열어 플로우 확인

2.  **샌드박스에서 확인이 필요하면**
    - [ ] `cd C:\Android\platform-tools`
    - [ ] `adb devices` (device 확인)
    - [ ] `adb reverse tcp:8081 tcp:8081`
    - [ ] `adb reverse tcp:5173 tcp:5173`
    - [ ] 샌드박스 → `오늘의 짝궁` 실행

3.  **오늘 할 일 선택하기**
    - [ ] Profile 화면 정리
    - [ ] TodayFortune 메시지/키워드 다듬기
    - [ ] PremiumReport 텍스트 작성
    - [ ] README/문서 업데이트

---

## 6. 중장기 로드맵 (Evolution Plan)

### Phase 2: 수익화 & 퀄리티 업 (Retention & Monetization)
> **핵심:** "더 보고 싶으면 광고를 보세요" (Freemium Model)

- [ ] **LLM 기반 심층 운세 (Oracle AI)**
  - 기존 룰 기반 운세를 프롬프트 엔지니어링으로 고도화
  - 보상형 광고(Rewarded Ads) 시청 시 상세 풀이 제공
- [ ] **소셜 바이럴 (Friends Match)**
  - "이 링크로 들어와봐!" → 친구/연인과 나의 **오늘의 케미(궁합)** 분석
  - 자연스러운 신규 유저 유입 유도

### Phase 3: 비주얼 & 엔터테인먼트 (Visual & Engagement)
> **핵심:** "텍스트보다 강력한 이미지 공유"

- [ ] **AI 짝꿍 이미지 생성 (Visual Persona)**
  - 오늘의 운세에 맞는 이상형/짝꿍 이미지를 AI로 생성
  - 미형의 캐릭터 (웹툰/실사 스타일) 제공으로 공유 욕구 자극
- [ ] **운세 카드 수집 (Collection)**
  - 매일 다른 짝꿍 캐릭터를 도감에 수집 (Gamification)

### Phase 4: 엔진 고도화 (Deep Dive Engine)
- [ ] **전통 사주(명리학) 알고리즘 통합**
  - 단순 생년월일 운세를 넘어 만세력 기반의 정교한 로직 탑재
- [ ] **성향 분석 통합 (Grand Theory)**
  - 사주 + 심층 심리(휴먼디자인/애니어그램 요소 차용)를 결합한 '초정밀 성향 분석'
  - *주의: 이론을 그대로 노출하기보다 "당신은 '전략가형' 짝꿍입니다" 처럼 직관적으로 풀이*
```
