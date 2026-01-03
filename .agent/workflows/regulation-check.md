---
description: 규정 준수 및 가이드라인 확인 프로세스 (Regulation Compliance Check)
---

# 규정 준수 및 가이드라인 확인 프로세스

토스 인앱(Apps-in-Toss) 환경은 특수한 네이티브 브릿지와 규정이 존재하므로, 모든 수정 작업 시 다음 단계를 준수합니다.

## 1. 수정 전 규정 확인 (Pre-check Regulations)
- 수정하려는 항목(예: 내비게이션 바, 아이콘, 광고, 권한 등)과 관련된 공식 문서를 `reference/` 폴더에서 먼저 검토합니다.
- 특히 `miniapp-branding-guide.md`, `NavigationBar.md`, `app-nongame.md` 등 핵심 설계 가이드를 우선 확인합니다.

## 2. 외부 레퍼런스 및 예제 검토
- `RESOURCES.md`에 기재된 조코딩 튜토리얼 및 공식 예제 코드(`reference/apps-in-toss-examples-main`)를 참고하여 실제 구현 사례가 규정과 일치하는지 확인합니다.

## 3. 구현 제약 사항 준수
- **아이콘**: `brand.icon`은 외부에서 접근 가능한 **절대 URL(HTTPS)**이어야 하며, 규격(600x600 PNG 등)을 엄수합니다.
- **TDS**: UI 수정 시 반드시 `TDSMobileAITProvider` 기반의 TDS 컴포넌트를 사용합니다.
- **네이티브 브릿지**: 웹 전용 로직(로컬 경로 등)이 네이티브 영역(상단 바, 브릿지 등)에서 오동작할 수 있음을 항상 인지합니다.

// turbo
## 4. 검증 프로세스
- 수정 후에는 샌드박스 환경에서 실제 기기(iPhone/Android) 동작을 확인합니다.
- 규정 위반으로 인한 반려를 방지하기 위해 출시 체크리스트를 상시 대조합니다.
