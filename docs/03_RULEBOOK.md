# 03. 프로젝트 규칙 (Project Rulebook)

이 문서는 '오늘의 짝꿍' 프로젝트를 개발할 때 반드시 지켜야 하는 **규정(Regulations)**과 **작업 원칙(Guidelines)**을 정리한 문서입니다.

---

## 🚀 1. 핵심 우선순위 (Top Priority)
> [!IMPORTANT]
> **모든 개발 작업 전, 반드시 토스 인앱(Apps-in-Toss) 규정을 확인하고 코드를 작성합니다.**

---

## 🛠 2. 토스 인앱 개발 가이드 (Apps-in-Toss Rules)

토스 인앱 환경은 특수한 네이티브 브릿지와 규정이 존재합니다.

### 2.1 UI/UX 제약 사항
- **TDS 사용**: UI 수정 시 반드시 `TDSMobileAITProvider` 기반의 **TDS(Toss Design System)** 컴포넌트로 구현합니다.
- **내비게이션 바**: 상단 내비게이션 바 설정 시 공식 문서(`NavigationBar.md`)의 규격에 따릅니다.
- **아이콘**: `brand.icon`은 외부에서 접근 가능한 **절대 URL(HTTPS)**이어야 하며, 규격(600x600 PNG 등)을 엄수합니다.

### 2.2 기술적 제약 사항
- **네이티브 브릿지**: 웹 전용 로직(로컬 경로 등)이 네이티브 영역에서 오동작할 수 있음을 항상 인지합니다.
- **권한 관리**: 센서나 위치 정보 접근 시 토스 인앱 권한 가이드를 준수합니다.

---

## 🤖 3. AI 에이전트 작업 원칙 (AI Agent Rules)

- **터미널 자동화**: 모든 터미널 명령 실행 시 `SafeToAutoRun: true`를 기본으로 설정합니다. (사용자 사전 승인 완료)
- **규정 선검토**: 수정 작업 전에 `reference/` 폴더 내 관련 가이드라인(`miniapp-branding-guide.md` 등)을 먼저 검토합니다.
- **아티팩트 관리**: 계획(`implementation_plan`), 작업 히스토리(`task`), 결과 보고(`walkthrough`)는 브레인 저장소에 철저히 기록합니다.

---

## 📋 4. 출시 전 체크리스트 (Launch Checklist)
- [ ] 샌드박스 환경에서 실제 기기(iPhone/Android) 동작 확인.
- [ ] 출시 체크리스트(Launch Checklist) 대조를 통한 반려 방지.
- [ ] 모든 자산(Images/Icons)의 절대 URL 확인.

---

## 🛡 5. 안티그래비티 검증 수칙 (AntiGravity Verification Protocol)

안티그래비티(쪼수)는 코드의 품질과 동작을 책임지며, 다음 **3단계 검증 프로세스**를 반드시 준수합니다.

### Step 1: 기본 무결성 확보 (Zero Problems)
- **Editor Problems 확인**: IDE(VS Code)의 `Problems` 탭에 표시되는 문법 오류, 타입 불일치, 린트 에러를 **0건**으로 만듭니다.
- **Lint/Build 수행**: `npm run lint` 및 `npm run build`를 실행하여 컴파일 단계의 오류를 완전히 제거합니다.
- **`import type` 준수**: 타입 정의 파일(`types.ts`)의 인터페이스를 가져올 때는 반드시 `import type`을 사용하여 런타임 충돌을 방지합니다.

### Step 2: 로직 검증 (Script Verification)
- **검증 코드 실행**: 주요 기능(사주, 휴먼디자인, 에니어그램 등 복잡한 로직) 수정 시, 반드시 해당 로직을 테스트하는 검증 스크립트(예: `src/scripts/verify_*.ts`)를 작성하거나 실행합니다.
- **데이터 정합성 확인**: 특정 입력값(예: 1980-03-10 동호님 생일)에 대해 예상된 결과값이 나오는지 스크립트 레벨에서 확인합니다.

### Step 3: 브라우저 실전 검증 (Browser Validation)
- **라이브 렌더링 확인**: 안티그래비티의 브라우저 제어 능력을 활용하여, 로컬 서버(`localhost`)를 열고 실제 화면이 깨짐 없이 렌더링되는지 확인합니다.
- **사용자 시나리오 테스트**: 단순히 페이지만 띄우는 것이 아니라, 실제 사용자처럼 버튼을 클릭하고 데이터를 입력하여 기능이 정상 작동하는지 눈으로 검증합니다.
