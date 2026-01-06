# 1. 통합 프로필 및 캐릭터 시스템 설계

## 1. 개요 (Overview)
이 문서는 **사주(명리학)**, **휴먼디자인**, 그리고 **에니어그램**이라는 세 가지 주요 성향 분석 시스템을 하나의 통합된 사용자 프로필로 결합하기 위한 최상위 설계서(Hub)입니다.

## 2. 통합 아키텍처 (Integration Architecture)

성향 분석의 3단계 레이어링:
1.  **사주 (The Foundation)**: 타고난 배경 에너지와 컬러 (그라운드)
    *   [2. 사주 이론 상세](./02_saju_theory.md)
2.  **휴먼디자인 (The Operating System)**: 사회적 상호작용 및 작동 방식 (기능)
    *   [3. 휴디 이론 상세](./03_hudi_theory.md)
3.  **에니어그램 (The Motivation)**: 내면적 동기 및 캐릭터의 본질 (원형)
    *   [4. 에니어 이론 상세](./04_enneagram_theory.md)

## 3. 캐릭터 생성 알고리즘 (Character Creation Logic)

**공식:** `캐릭터 = [수식어] + [종족] + [테마색] + [소품/스타일]`

### 3.1 종족 선택 우선순위 (Species Priority)
단일 시스템에 의존하지 않고, 사용자의 선택과 분석 결과를 결합하여 최적의 종족을 결정합니다.
1.  **사용자 지정 (User Preference)**: 사용자가 직접 선택한 동물 (예: 티라노, 기린, 거북이 등).
2.  **심층 분석 (Enneagram)**: 성격 유형에 따른 동물 아키타입 (04 이론 참조).
3.  **전통 상징 (Saju Zodiac)**: 
    *   **일주 지지**: 일지(Day Branch)가 나타내는 동물 (예: 임오 -> 말).
    *   **연주 지지**: 태어난 해의 띠 (예: 경신 -> 원숭이).

### 3.2 수식어 로직 (Modifier / Adjective)
캐릭터의 성격이나 상태를 나타내는 형용사를 추가하여 입체감을 부여합니다.
- **사주 기반**: 오행의 강약에 따른 속성 (예: 느긋한, 열정적인, 냉철한).
- **휴먼디자인 기반**: 타입 및 프로필 특성 (예: 선구적인, 응답하는, 실험적인).

### 3.3 로직 테이블 (Expanded)
| 구성 요소 | 출처 시스템 | 캐릭터 반영 요소 |
| :--- | :--- | :--- |
| **수식어 (Modifier)** | **사주/휴디** | 캐릭터의 상태나 성격을 나타내는 형용사 (예: 느긋한, 모험심 강한) |
| **종족 (Species)** | **사용자/에니어/사주** | 캐릭터의 기본 외형 (예: 티라노, 기린, 원숭이 등) |
| **컬러 (Color)** | **사주 (일간/오행)** | 캐릭터의 테마 색상 (예: 파스텔 블루, 선명한 레드 등) |
| **스타일 (Style)** | **휴먼디자인** | 캐릭터의 복장 및 액세서리 (예: 고글, 배낭, 왕관 등) |

## 4. 데이터 연동 구조 (Data Structure)
각 시스템에서 도출된 핵심 키워드와 색상 코드를 JSON 형태로 관리하여 UI 컴포넌트로 전달합니다.

```json
{
  "profileId": "user_01",
  "visuals": {
    "baseSpecies": "Monkey",
    "mainColor": "#FFD700",
    "accItem": "Aviator Goggles"
  },
  "deepLinks": {
    "saju": "../profiles/potato_saju.md",
    "hudi": "../profiles/potato_hudi.md",
    "enneagram": "../profiles/potato_enneagram.md"
  }
}
```

## 5. 사례 분석 (Case Studies)
*   **감자씨 (Dong-ho / 동호)**: 1980년 음력 3월 10일 (임오일주, 7w8, Generator)
    *   [사주 리포트](../profiles/potato_saju.md) | [휴디 리포트](../profiles/potato_hudi.md) | [에니어 리포트](../profiles/potato_enneagram.md)
*   [감자씨 사례 분석 리포트 (통합 버전)](./potato_analysis_summary.md) (작업 예정)
