# 📚 문서 가이드 (Documentation Guide)

> **이 문서는 프로젝트의 모든 문서 체계를 설명합니다.**  
> 개발, 검증, 출시 시 어떤 문서를 참조해야 하는지 안내합니다.

**최종 업데이트**: 2026-01-19

---

## 📋 문서 체계 개요

```
docs/
├── 🔴 필수 참조 (개발/출시 시 필수)
│   ├── 00_KNOWLEDGE.md        ← 프로젝트 지식 베이스 (사주/휴디/에니어 이론)
│   ├── 03_RULEBOOK.md         ← 프로젝트 규칙 및 원칙 ⭐
│   ├── 05_PRODUCTION_CHECKLIST.md ← 출시 전 체크리스트
│   └── 07_RELEASE_HISTORY.md  ← 릴리스 히스토리 ⭐ (신규)
│
├── 🟡 참조용 (필요 시 확인)
│   ├── 01_PROJECT_PLAN.md     ← 프로젝트 로드맵
│   ├── 02_RESOURCES.md        ← 외부 리소스 링크
│   ├── 04_REVIEW_GUIDE.md     ← 심사 제출 가이드
│   └── 06_BUILD_TROUBLESHOOTING.md ← 빌드 에러 해결
│
├── 🟢 히스토리 (기록용, 통합 예정)
│   ├── RULEBOOK.md            ← 03_RULEBOOK.md로 통합 예정 🔄
│   ├── STATUS.md              ← 07_RELEASE_HISTORY.md로 통합 예정 🔄
│   ├── COMPLETION_REPORT.md   ← 검증 폴더로 이동 예정 🔄
│   ├── PRE_LAUNCH_REPORT.md   ← 검증 폴더로 이동 예정 🔄
│   └── PAGE_LIST.md           ← 07_RELEASE_HISTORY.md로 통합 예정 🔄
│
└── 📁 하위 폴더
    ├── assets/                ← 버전별 스크린샷
    ├── profiles/              ← 사용자 프로필 분석 문서
    ├── theory/                ← 사주/휴디/에니어 이론 상세
    └── verification/          ← 버전별 검증 보고서

.agent/workflows/              ← 워크플로우 (슬래시 커맨드)
├── /build-release             ← 빌드 및 출시 프로세스 ⭐
├── /qc-validation             ← 품질 검증 프로세스
└── /regulation-check          ← 규정 준수 확인
```

---

## 🎯 상황별 참조 문서

### 📌 "개발해줘" (신규 기능 개발)

| 순서 | 문서 | 역할 |
|:---:|------|------|
| 1 | `07_RELEASE_HISTORY.md` | 현재 버전 기능 목록 확인 |
| 2 | `00_KNOWLEDGE.md` | 도메인 지식 (사주/휴디/에니어) |
| 3 | `03_RULEBOOK.md` | 개발 원칙 및 규정 |

### 📌 "검증해줘" (QC 및 테스트)

| 순서 | 문서/워크플로우 | 역할 |
|:---:|------|------|
| 1 | `/qc-validation` | 품질 검증 실행 (npm run qc) |
| 2 | `/regulation-check` | 토스 규정 준수 확인 |
| 3 | `05_PRODUCTION_CHECKLIST.md` | 출시 전 체크리스트 |

### 📌 "출시해줘" (빌드 및 배포)

| 순서 | 문서/워크플로우 | 역할 |
|:---:|------|------|
| 1 | `/build-release` | 전체 출시 프로세스 ⭐ |
| 2 | `07_RELEASE_HISTORY.md` | 릴리스 히스토리 업데이트 |
| 3 | `docs/verification/vX.Y.Z/` | 검증 보고서 작성 |

### 📌 "심사 제출해줘" (토스 콘솔 제출)

| 순서 | 문서 | 역할 |
|:---:|------|------|
| 1 | `04_REVIEW_GUIDE.md` | 심사 제출 내용 작성 |
| 2 | `05_PRODUCTION_CHECKLIST.md` | 최종 체크리스트 |

---

## 🔄 통합 계획 (Consolidation Plan)

### 중복 문서 정리

| 현재 문서 | 처리 | 통합 대상 |
|----------|:----:|----------|
| `RULEBOOK.md` | 🔄 통합 | → `03_RULEBOOK.md` |
| `STATUS.md` | 🔄 통합 | → `07_RELEASE_HISTORY.md` |
| `PAGE_LIST.md` | 🔄 통합 | → `07_RELEASE_HISTORY.md` |
| `COMPLETION_REPORT.md` | 📦 이동 | → `docs/verification/v1.0.0/` |
| `PRE_LAUNCH_REPORT.md` | 📦 이동 | → `docs/verification/v1.0.0/` |

### 우선순위 체계

```
Level 1 (최상위 - 개발 시작 전 필독)
├── 03_RULEBOOK.md          ← 프로젝트 규칙
└── 07_RELEASE_HISTORY.md   ← 기능 목록 및 출시 히스토리

Level 2 (작업 시 참조)
├── 00_KNOWLEDGE.md         ← 도메인 지식
├── 05_PRODUCTION_CHECKLIST.md ← 출시 체크리스트
└── .agent/workflows/*      ← 워크플로우

Level 3 (필요 시 참조)
├── 01~02, 04, 06 번 문서   ← 보조 문서
└── theory/, profiles/      ← 상세 자료
```

---

## ✅ 워크플로우 실행 방법

### `/build-release` - 빌드 및 출시
```
사용자: /build-release
에이전트: 빌드 워크플로우 실행 (0단계~12단계)
```

### `/qc-validation` - 품질 검증
```
사용자: /qc-validation
에이전트: QC 워크플로우 실행 (lint, test, build)
```

### `/regulation-check` - 규정 확인
```
사용자: /regulation-check
에이전트: 토스 규정 준수 확인
```

---

## 🚨 중요 규칙

### 1. 기능 개발 후 반드시
- [ ] `07_RELEASE_HISTORY.md`에 신규 기능 추가
- [ ] 스크린샷 저장 (`docs/assets/vX.Y.Z/`)

### 2. 출시 전 반드시
- [ ] `/build-release` 워크플로우의 0단계(기능 목록 검증) 수행
- [ ] 담당자 승인 획득 후 출시

### 3. Git Stash 사용 시
- [ ] stash 내용 메모
- [ ] 작업 완료 후 반드시 복구 또는 명시적 삭제

---

*이 문서는 프로젝트 문서 체계의 인덱스 역할을 합니다.*
