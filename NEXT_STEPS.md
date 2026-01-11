# 📋 다음 작업 가이드 (Next Steps)

**마지막 업데이트**: 2026-01-11 10:39 KST  
**현재 버전**: v1.0.1  
**상태**: 🚀 출시 요청 완료

---

## ✅ 완료된 작업

### 2026-01-11 (오늘)
1. ✅ React Error #130 완전 해결 (광고 관련)
2. ✅ 토스 광고 정상 작동 확인
3. ✅ 띠 아이콘 수정 (원숭이 고정 → 년주 기준)
4. ✅ 마크다운 렌더링 개선
5. ✅ 홈 화면 문구 개선 (오타 수정)
6. ✅ QC 테스트 강화 (광고 검증 추가)
7. ✅ 출시 요청 (토스 콘솔)

---

## 🔜 다음에 할 작업

### 1순위: 출시 심사 대응
- [ ] 토스 심사 결과 확인 (보통 1-3일 소요)
- [ ] 반려 시 피드백 확인 및 수정
- [ ] 승인 시 실제 유저 테스트

### 2순위: 기능 개선
- [ ] 실제 광고 ID 적용 (테스트 ID → 프로덕션 ID)
- [ ] 짝꿍 이미지 다양화 (현재 정적 이미지)
- [ ] 프리미엄 리포트 LLM 응답 품질 개선
- [ ] 공유하기 기능 강화

### 3순위: 추가 기능
- [ ] 푸시 알림 (매일 운세)
- [ ] 꿍친 궁합 상세 페이지
- [ ] 연애 상담 채팅봇

---

## ⚠️ 검증 시 주의사항

### QC 실행 필수
```bash
npm run qc
```
- 12개 테스트 전부 통과해야 빌드 가능
- 광고 브릿지 임포트 확인 테스트 포함

### 빌드 전 체크리스트
1. `npx tsc --noEmit` - 타입 에러 없어야 함
2. `npm run lint` - ESLint 에러 없어야 함
3. `npm run test` - 12개 테스트 통과
4. `npm run build` - `todays-match.ait` 생성 확인

### 로컬 vs 토스 환경 차이
| 기능 | 로컬 (localhost) | 토스 앱 |
|------|-----------------|--------|
| 광고 | 자동 스킵 (0.5초 후 보상) | 실제 광고 시청 필요 |
| GoogleAdMob | undefined | 정상 로드 |
| 네이티브 기능 | 미지원 | 지원 |

### 자주 발생하는 문제

#### 1. React Error #130 (흰 화면)
- **원인**: undefined 컴포넌트 렌더링
- **확인**: `useRewardedAd.ts`에서 `@apps-in-toss/web-bridge` 임포트 확인
- **해결**: 토스 브릿지 임포트가 제거되지 않았는지 QC 테스트로 확인

#### 2. 광고 작동 안 함
- **확인**: `TEST_AD_GROUP_ID` 값 확인
- **확인**: `GoogleAdMob.loadAppsInTossAdMob` 호출 확인
- **해결**: `npm run test`로 광고 관련 테스트 확인

#### 3. 띠 아이콘 잘못 표시
- **원인**: `profile.saju.pillars.year.zodiac` 없음
- **확인**: 생년월일 입력 시 사주 자동 계산되는지 확인
- **해결**: `profileAnalysis.ts`의 우선순위 로직 확인

---

## 📁 핵심 파일 위치

```
프로젝트 구조:
├── src/
│   ├── hooks/
│   │   └── useRewardedAd.ts    ⭐ 광고 로직 (중요!)
│   ├── pages/
│   │   ├── Home.tsx            홈 화면
│   │   ├── TodayFortune.tsx    오늘의 운세
│   │   └── PremiumReport.tsx   프리미엄 리포트
│   ├── utils/
│   │   ├── fortune.ts          운세 계산
│   │   ├── sajuEngine.ts       사주 계산
│   │   ├── profileAnalysis.ts  캐릭터 생성
│   │   ├── matchImageGenerator.ts  짝꿍 이미지
│   │   └── llm.ts              LLM API 연동
│   └── types.ts                타입 정의
├── qc.test.ts                  ⭐ QC 테스트 (중요!)
├── reference/                  토스 가이드 문서
└── docs/verification/          검증 기록
```

---

## 🔧 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# QC 검증
npm run qc

# 빌드
npm run build

# 배포 (토스 콘솔)
npm run deploy
```

---

## 📞 참고 자료

- **토스 개발자 문서**: https://developers-apps-in-toss.toss.im/
- **비게임 출시 가이드**: `reference/4_출시/app-nongame.md`
- **저장**: https://github.com/imejaim/toss-todays-match

---

다음 작업 시 이 문서를 먼저 확인하세요! 🚀
