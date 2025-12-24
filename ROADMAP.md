# 🚀 Future Roadmap: Today's Match (오늘의 짝꿍)

현재 v1.0.0 (기본 운세 및 리포트) 런칭 이후, 앱을 더욱 재미있고 풍성하게 만들기 위한 개발 로드맵입니다.

## 🌟 Vision
단순한 운세를 넘어, 사용자의 **고유한 특성(사주, 휴먼디자인, 애니어그램)**을 입체적으로 분석하여 **"나"를 발견**하고, **"최고의 케미"**를 찾아주는 엔터테인먼트 플랫폼으로 진화합니다.

---

## 📅 Phases (개발 단계)

### Phase 1: 기반 다지기 (Foundation & Reliability) - ✅ Current
- [x] v1.0.0 런칭 (안정적인 운세 확인 및 심화 리포트)
- [x] 토스 인앱 딥링크 연동 (`intoss://`)
- [x] 업데이트 프로세스(CI/CD, 템플릿) 확립
- [ ] **Next**: 기본 UI/UX 고도화 (사용자 피드백 반영) 및 성능 최적화

### Phase 2: 나를 더 깊이 알기 (Deep Personalization)
**"단순 별자리가 아닌, 입체적인 나"**
LLM을 활용하여 동양(사주)과 서양(휴먼디자인, 애니어그램)의 지혜를 통합 분석합니다.

1.  **사주(Four Pillars) 분석 도입**
    *   입력받은 생년월일시를 만세력 로직(또는 API)으로 변환하여 일주(예: 임오일주) 도출
    *   **LLM Prompt 예시**: *"사용자는 '큰 물(임수)'의 기질을 가졌어. 오늘은 '금'의 기운이 강한 날이라 자신감이 넘칠 거야. 이런 특성을 바탕으로 오늘의 연애 조언을 해줘."*
2.  **휴먼디자인(Human Design) 통합**
    *   사용자 데이터 기반 타입(매니패스터, 제너레이터 등) 도출
    *   **Action**: "당신은 리더형인 매니패스터니, 짝꿍에게 먼저 데이트를 제안해보세요!" 같은 구체적 행동 지침 제공
3.  **애니어그램(Enneagram) 약식 테스트**
    *   복잡한 검사 대신, **3가지 핵심 질문**으로 유형 추론
    *   결과를 프로필에 저장하여 매칭 알고리즘에 반영

### Phase 3: 시각화 & 캐릭터 (Visualization & Character)
**"말로만 듣던 내 짝꿍, 눈으로 확인하기"**
AI 이미지 생성 기술을 활용해 재미 요소를 극대화합니다.

1.  **나만의 캐릭터 생성**
    *   `사주(속성/컬러)` + `휴먼디자인(아우라)` + `애니어그램(분위기)` 조합 프롬프트 생성
    *   **Feature**: "나의 영혼을 형성하는 3가지 재료로 만든 캐릭터" 카드 발급
2.  **오늘의 짝꿍 시각화 (Nano Banana / Image Gen 연결)**
    *   오늘 운세 데이터를 기반으로 **"오늘 나랑 딱 맞는 가상 짝꿍"** 얼굴/스타일 그려주기
    *   *예: "오늘은 차분한 도서관 사서 스타일의 이성이 행운을 줘요!" → 해당 이미지 생성*

### Phase 4: 현실 연결 (Real Connection)
**"가상을 넘어 진짜 내 사람들과"**

1.  **지인 등록 & 리얼 매칭**
    *   친구/연인의 프로필(생년월일 등) 등록 기능
    *   **Feature**: 매일 아침 *"등록된 친구 5명 중, 오늘 가장 케미가 좋은 사람은 000입니다!"* 알림
2.  **궁합 배틀**
    *   내 캐릭터 vs 친구 캐릭터의 궁합 시뮬레이션

---

## 🛠 Tech Strategy (LLM & API)

앞으로 추가될 방대한 분석 로직(사주, 휴먼디자인 등)을 효율적으로 처리하기 위해 **Modular Prompting** 방식을 사용합니다.

```typescript
// 예시: LLM 요청 구조
const prompt = `
[User Profile]
- Saju: Im-O (Water/Horse)
- Human Design: Manifestor (Leader)
- Enneagram: Type 3 (Achiever)

[Today's Context]
- Daily Energy: Metal (Supportive of Water)

[Task]
Based on the above traits, generate a "Daily Love Chemistry Report".
1. Interpret today's confidence level based on Saju.
2. Suggest an action item based on Human Design strategy.
3. Describe the ideal partner's vibe today.
`;
```

이 로드맵은 언제든 아이디어가 떠오를 때마다 수정하고 발전시켜 나갈 것입니다. 🚀
