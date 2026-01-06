# 📜 Development Rulebook (v1.0)

## 1. UI & Styling Principles
- **Web-Universal Architecture**: 모든 UI 컴포넌트는 일반 웹 브라우저에서도 문제 없이 렌더링되어야 합니다.
- **TDS-Like Aesthetics**: 토스 디자인 시스템(TDS)의 감성(미니멀리즘, 둥근 모서리, 부드러운 그림자, 파란색 `#3182f6`)을 커스텀 CSS로 유지합니다.
- **Avoid Heavy Libraries**: `@toss/tds-mobile` 등 시스템 환경에 의존적인 패키지 사용을 지양하고, `src/components/ui.tsx`에 필요한 컴포넌트를 추가하여 사용합니다.

## 2. Character & Content
- **Korean First**: 캐릭터 설명 및 에너지 이름은 한글과 이모지를 병행 표기합니다. 
    - ❌ `mainColor: #A8D8EA` 노출 금지
    - ✅ `목(木) 🌳` 처럼 의미 있는 이름 노출
- **No Placeholders**: 이미지가 필요한 경우 `generate_image` 툴을 사용해 실제 데모를 생성하거나 아바타(이모지) 시스템을 활용합니다.

## 3. Workflow Rules
- **Verify on Web**: 모든 신규 기능은 먼저 `localhost:5173`에서 웹 브라우저 테스트를 거친 후 토스 배포를 준비합니다.
- **Build & Deploy**: 토스 앱 전용 빌드가 필요한 경우 `npm run build`를 통해 `.ait` 파일을 생성합니다.

## 4. Documentation
- 모든 메이저 변경 사항은 `docs/STATUS.md`에 기록합니다.
- 새로운 페이지나 컴포넌트 추가 시 스크린샷을 찍어 `docs/assets/`에 보관합니다.
