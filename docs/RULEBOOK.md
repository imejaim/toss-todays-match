# 📜 Development Rulebook (v2.0)

> ⚠️ **DEPRECATED**: 이 문서는 `docs/03_RULEBOOK.md`로 통합되었습니다.  
> 최신 규칙은 **03_RULEBOOK.md**를 참조하세요.

---

~~이 문서는 프로젝트의 **최상위 헌법(Master Rule)**입니다.~~
~~모든 개발 작업은 이 문서의 규칙을 최우선으로 준수해야 하며, 하위 문서들은 이 룰북의 지침을 따릅니다.~~

## 0. Document Hierarchy (문서 체계)
본 프로젝트의 문서는 다음 위계를 가집니다.

1.  **Level 1: 헌법 (Rulebook)**
    - 위치: `docs/RULEBOOK.md` (본 문서)
    - 역할: 프로젝트의 대원칙, 필수 프로세스, 아키텍처 정의.
    - **[중요] 에이전트는 작업 시작 전 본 문서를 반드시 숙지해야 함.**

2.  **Level 2: 실천 지침 (Workflows)**
    - 위치: `.agent/workflows/*.md`
    - 역할: 헌법을 이행하기 위한 구체적인 실행 절차.
    - 주요 파일:
        - `qc-validation.md`: 빌드 및 배포 전 필수 검증 절차(Lint, Test, Build).
        - `regulation-check.md`: 토스 플랫폼 규정 준수 체크리스트.

3.  **Level 3: 증거 및 기록 (Evidence & Logs)**
    - 위치: `VALIDATION_EVIDENCE.md`, `docs/STATUS.md`, `docs/PRE_LAUNCH_REPORT.md`
    - 역할: 절차가 수행되었음을 증명하는 결과물 및 출시 전 최종 검증 보고서.

## 1. Quality Control & Validation Rules (품질 관리)
배포 파일(`.ait`)을 생성하거나 코드를 병합하기 전, 반드시 다음 절차를 수행해야 합니다.

- **필수 검증 명령**: `npm run qc` (Lint + Test 통합)
- **타입 정밀 검사**: `npx tsc --noEmit` (빌드 전 필수 수행)
- **API Health Check**: 백엔드 연결성 확인 (수동 또는 `qc.test.ts` 통합)
- **상세 절차**: [.agent/workflows/qc-validation.md](../.agent/workflows/qc-validation.md) 참조.

## 2. API & Backend Rules
- **Backend URL**: `https://todaysmatch-423863342.us-central1.run.app`
- **Verification**: `npm run qc` 실행 시 API 연결성 테스트가 포함되어 있어야 합니다.
- **Error Handling**: API 실패 시에도 앱이 멈추지 않도록 Mock Data 등 Fallback 로직이 필수입니다.

## 3. UI & Styling Principles
- **Web-Universal Architecture**: 모든 컴포넌트는 일반 웹 브라우저(`localhost`)에서 렌더링 가능해야 합니다.
- **TDS-Like Aesthetics**: 토스 디자인 시스템(TDS) 스타일을 유지하되, 외부 무거운 라이브러리 대신 `src/components/ui.tsx`를 사용합니다.

## 4. Work Logic & Memory
- 에이전트는 작업 도중 중요한 **결정 사항(Decision)**이나 **새로운 규칙**이 생기면 즉시 이 `RULEBOOK.md`를 업데이트해야 합니다.
- 반복되는 사용자 지시("API 체크했어?", "빌드 전 검사했어?")가 발생하지 않도록, 모든 프로세스를 `.agent/workflows/`에 코드로 만들어둡니다.

