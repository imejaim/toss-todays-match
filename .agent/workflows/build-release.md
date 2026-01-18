---
description: 토스 인앱 빌드 및 출시 프로세스 (Build & Release)
---

# 빌드 및 출시 워크플로우

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

// turbo
### 8. Git 커밋 및 푸시
```powershell
git add .
git commit -m "build: GitHub 이미지 로드 방식 적용"
git push
```

### 9. 토스 콘솔 업로드 (수동)
1. [토스 개발자 콘솔](https://developers-apps-in-toss.toss.im/) 접속
2. 버전 관리 > 새 버전 만들기
3. `todays-match.ait` 파일 업로드
4. 테스트 후 검토 요청

## 참고 문서
- `docs/05_PRODUCTION_CHECKLIST.md` - 출시 전 체크리스트
- `docs/06_BUILD_TROUBLESHOOTING.md` - 빌드 에러 해결
- `reference/4_출시/deploy.md` - 토스 배포 가이드
