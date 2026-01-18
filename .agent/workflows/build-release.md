---
description: 토스 인앱 빌드 및 출시 프로세스 (Build & Release)
---

# 빌드 및 출시 워크플로우

> ⚠️ **중요**: 2026-01-18 사고 이후 강화된 프로세스입니다.
> 기능 누락 방지를 위해 반드시 모든 단계를 수행하세요.

---

## 🔴 0단계: 기능 목록 검증 (MANDATORY)

### 0-1. 릴리스 히스토리 문서 확인
```powershell
Get-Content docs/07_RELEASE_HISTORY.md | Select-String -Pattern "v1.0"
```

### 0-2. 이전 버전 대비 기능 변경 확인
- [ ] `docs/07_RELEASE_HISTORY.md`에서 이전 버전 기능 목록 확인
- [ ] 현재 개발된 신규 기능 목록 작성
- [ ] **누락된 기능이 없는지 확인**

### 0-3. Git Stash 확인 (필수!)
```powershell
git stash list
```
**stash가 있다면 반드시 내용 확인 후 복구 여부 결정!**

### 0-4. 작업 중인 변경사항 확인
```powershell
git status
git diff --stat
```

---

## 빌드 전 필수 확인 (Pre-Build Checklist)

// turbo
### 1. 상위 폴더 node_modules 확인 및 삭제
```powershell
if (Test-Path "C:\Project\2_TossInApp\node_modules") { Remove-Item -Recurse -Force "C:\Project\2_TossInApp\node_modules" }
```

// turbo
### 2. vite.config.ts 상태 확인
```powershell
Get-Content vite.config.ts | Select-String -Pattern "alias|exclude"
```
**결과가 있으면 문제!** → vite.config.ts를 기본 상태로 복원 필요

// turbo
### 3. 캐시 정리
```powershell
Remove-Item -Recurse -Force "node_modules/.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
```

## 빌드 실행

// turbo
### 4. 린트 확인
```powershell
npm run lint
```

// turbo
### 5. 테스트 실행
```powershell
npm run test
```

// turbo
### 6. 프로덕션 빌드
```powershell
npm run build
```

// turbo
### 7. 빌드 결과 확인
```powershell
Get-ChildItem "todays-match.ait" | Select-Object Name, Length, LastWriteTime
```

## 빌드 실패 시

### 에러 로그 저장 및 확인
```powershell
npm run build 2>&1 | Out-File -FilePath build_error.log -Encoding UTF8
Get-Content build_error.log
```

### 주요 에러 해결책
- **`Could not resolve "@apps-in-toss/framework"`** → 상위 폴더 node_modules 삭제
- **`Could not resolve "./StatusBar"`** → vite.config.ts 기본 상태로 복원
- **테스트 실패** → qc.test.ts 확인, 에러 메시지 확인

## 빌드 성공 후

### 8. 📸 스크린샷 저장 (필수!)
> 모든 화면을 캡처하여 버전별 폴더에 저장합니다.

```powershell
# 버전 폴더 생성 (버전 번호 수정 필요)
New-Item -ItemType Directory -Force -Path "docs/assets/v1.0.2"
```

**저장할 스크린샷 목록:**
- [ ] `home.png` - 홈 화면
- [ ] `profile.png` - 프로필 입력 화면
- [ ] `today_fortune.png` - 오늘의 운세 화면
- [ ] `premium_report.png` - 프리미엄 보고서 화면
- [ ] 기타 신규 기능 화면

### 9. 📝 릴리스 히스토리 업데이트
`docs/07_RELEASE_HISTORY.md` 파일에 다음 내용 추가:
- [ ] 버전 정보 (커밋 해시, 날짜)
- [ ] 신규 기능 목록
- [ ] 버그 수정 목록
- [ ] 스크린샷 경로

### 10. ✅ 승인 요청 (MANDATORY)
> ⚠️ **이 단계 없이 출시하지 마세요!**

담당자에게 다음 내용 확인 요청:
1. **기능 목록 검토** - 누락된 기능 없는지 확인
2. **스크린샷 검토** - 모든 화면이 정상인지 확인
3. **릴리스 히스토리 검토** - 문서 정확성 확인

**승인 후에만 다음 단계 진행!**

---

// turbo
### 11. Git 커밋 및 푸시
```powershell
git add .
git commit -m "release: v1.0.2 - [주요 변경 내용]"
git push
```

### 12. 토스 콘솔 업로드 (수동)
1. [토스 개발자 콘솔](https://developers-apps-in-toss.toss.im/) 접속
2. 버전 관리 > 새 버전 만들기
3. `todays-match.ait` 파일 업로드
4. 테스트 후 검토 요청

---

## 참고 문서
- `docs/05_PRODUCTION_CHECKLIST.md` - 출시 전 체크리스트
- `docs/06_BUILD_TROUBLESHOOTING.md` - 빌드 에러 해결
- `docs/07_RELEASE_HISTORY.md` - 릴리스 히스토리 ⭐ **필독**
- `reference/4_출시/deploy.md` - 토스 배포 가이드

