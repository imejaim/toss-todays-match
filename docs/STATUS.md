# 📄 Project Status Report (v0.2.0)

## 📌 Overview
현재 프로젝트는 **토스 인앱 환경**과 **일반 웹 브라우저 환경** 모두에서 완벽하게 작동하는 **Universal Web Version (v0.2.0)** 단계에 도달했습니다.

## 🚀 Version History
- **v0.1.0 (Toss-Only MVP)**: LLM 연동 및 토스 인앱 최적화 (웹 브라우저 하얀 화면 발생)
- **v0.2.0 (Web-Universal)**: 
    - `@toss/tds-mobile` 의존성 제거 및 커스텀 UI (`src/components/ui.tsx`) 도입
    - 일반 브라우저에서 렌더링 에러 해결
    - 분석 엔진(사주, 휴먼디자인, 에니어그램) 및 캐릭터 분석 유틸리티 추가
- **v0.3.0 (Character Integration)**:
    - 홈 화면 개편 (캐릭터 아바타 및 한글 에너지 배지 적용)
    - `#A8D8EA` 등 HEX 코드 노출 제거 및 한글 에너지 명칭 바인딩
- **v0.3.1 (My Friends List)**:
    - 꿍친(친구) 리스트 기능 활성화 (추가, 수정, 삭제)
    - 친구별 캐릭터 아바타 및 분석 데이터 연동

## 🛠 Tech Stack Changes
- **UI Framework**: `@toss/tds-mobile` → Custom CSS/HTML 기반 UI (Toss TDS 스타일 복제)
- **Provider**: `TDSMobileAITProvider` 제거 (웹 호환성 확보)
- **Engines**: 
    - `sajuEngine.ts`: 만세력 계산 로직
    - `hdEngine.ts`: 휴먼디자인 분석 (Simplified)
    - `enneagramEngine.ts`: 에니어그램 유형 매핑
    - `profileAnalysis.ts`: 캐릭터 프롬프트 및 에너지 변환 로직 추가

## 📍 Current Features
1. **내 캐릭터 프로필**: 사주 분석 엔진을 통한 아바타 및 에너지 정보를 홈 화면에서 확인
2. **꿍친(친구) 관리**: 여러 명의 친구 사주 정보를 등록하고 관리 가능
3. **오늘의 운세**: LLM 연동을 통한 실시간 운세 생성 및 점수 표시 ([Screen](docs/assets/v0.2.0/fortune.png))
4. **심층 리포트**: 광고 시청(Mock) 후 상세 분석 결과 제공 ([Screen](docs/assets/v0.2.0/report.png))

## 📸 Screenshots (v0.3.1)
| Home (Character) | Home (Friends) | Profile (Friend Add) |
|:---:|:---:|:---:|
| ![Home](docs/assets/v0.2.0/home.png) | (To be updated) | (To be updated) |

## 🚧 Next Steps (v0.4.0 목표)
1. **궁합 분석 시스템 (Affinity)**: 나루 친구들 간의 오행 상생/상극 궁합 점수 산출 로직 구현
2. **오늘의 추천 꿍친**: 궁합이 가장 좋은 친구를 홈 화면에 추천 표시
3. **운세 결과 페이지 보완**: 운세 결과 화면에도 내 캐릭터 아바타를 노출하여 몰입감 강화
