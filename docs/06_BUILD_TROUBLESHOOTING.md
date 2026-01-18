# 🔧 빌드 트러블슈팅 가이드 (Build Troubleshooting Guide)

**작성일**: 2026-01-18  
**목적**: 빌드 과정에서 발생한 문제들과 해결책을 기록하여 재발 방지

---

## 🚨 빌드 전 필수 체크리스트

> [!IMPORTANT]
> **빌드 명령어 실행 전 반드시 아래 항목을 확인하세요!**

### 1️⃣ 상위 폴더 node_modules 확인
```powershell
# 상위 폴더에 node_modules가 있으면 충돌 발생!
Test-Path "C:\Project\2_TossInApp\node_modules"
# True가 나오면 삭제 필요
Remove-Item -Recurse -Force "C:\Project\2_TossInApp\node_modules"
```

**문제 증상**: `Could not resolve "@apps-in-toss/framework"` 에러

---

### 2️⃣ vite.config.ts 상태 확인
```powershell
# vite.config.ts는 최소한으로 유지해야 함!
Get-Content vite.config.ts
```

**올바른 상태** (granite build가 자체적으로 처리):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**❌ 하지 말아야 할 것**:
- `resolve.alias`에 react-native 관련 모킹 추가 ❌
- `optimizeDeps.exclude` 추가 ❌
- `granite build`가 이미 처리하므로 수동 설정 불필요

**문제 증상**: `Could not resolve "./StatusBar"` 또는 `react-native-webview` 에러

---

### 3️⃣ 개발 서버 종료 확인
```powershell
# 개발 서버가 실행 중이면 포트 충돌 가능
Get-Process -Name "node" -ErrorAction SilentlyContinue | 
    Where-Object { $_.MainWindowTitle -like "*vite*" }
```

---

## 📋 올바른 빌드 명령어 순서

```powershell
# Step 1: 상위 폴더 node_modules 확인 및 삭제
if (Test-Path "C:\Project\2_TossInApp\node_modules") {
    Remove-Item -Recurse -Force "C:\Project\2_TossInApp\node_modules"
    Write-Host "상위 node_modules 삭제 완료" -ForegroundColor Green
}

# Step 2: 캐시 정리
Remove-Item -Recurse -Force "node_modules/.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue

# Step 3: 린트 확인
npm run lint

# Step 4: 테스트 실행
npm run test

# Step 5: 빌드
npm run build

# Step 6: 빌드 결과 확인
Get-ChildItem "todays-match.ait" | Select-Object Name, Length, LastWriteTime
```

---

## 🔴 자주 발생하는 에러와 해결책

### 에러 1: `Could not resolve "@apps-in-toss/framework"`
**원인**: 상위 폴더(`C:\Project\2_TossInApp\`)에 `node_modules`가 존재  
**해결**: 상위 폴더의 node_modules 삭제

### 에러 2: `Could not resolve "./StatusBar"` 또는 react-native 관련
**원인**: vite.config.ts에 불필요한 alias 설정 추가  
**해결**: vite.config.ts를 기본 상태로 복원 (위 참조)

### 에러 3: PowerShell에서 `&&` 구문 에러
**원인**: PowerShell 버전에 따라 `&&` 미지원  
**해결**: 명령어를 순차적으로 실행하거나 `;`로 연결
```powershell
# ❌ npm run lint && npm run build
# ✅ npm run lint; npm run build
```

### 에러 4: 에러 메시지가 잘려서 안 보임
**해결**: 에러를 파일로 저장 후 확인
```powershell
npm run build 2>&1 | Out-File -FilePath build_error.log -Encoding UTF8
Get-Content build_error.log
```

### 에러 5: 테스트 실패 (`hasTossBridgeImport` 관련)
**원인**: 테스트가 `import { GoogleAdMob }` 패턴을 찾는데, 현재 코드는 `declare const GoogleAdMob` 사용  
**해결**: qc.test.ts의 테스트를 현재 구현에 맞게 수정 (완료됨)

---

## ⚙️ vite.config.ts 수정 금지 규칙

> [!WARNING]
> `granite build`는 자체적으로 react-native 관련 의존성을 처리합니다.  
> **vite.config.ts에 alias나 exclude를 추가하면 오히려 빌드가 실패합니다!**

**수정해도 되는 것**:
- `plugins` 추가 (React 플러그인 등)

**수정하면 안 되는 것**:
- `resolve.alias` ❌
- `optimizeDeps.exclude` ❌
- react-native, @granite-js, @apps-in-toss 관련 설정 ❌

---

## 📁 관련 파일 체크리스트

| 파일 | 확인 사항 |
|------|----------|
| `vite.config.ts` | 최소한의 설정만 있어야 함 |
| `src/pages/PremiumReport.tsx` | GitHub 이미지 URL 사용 중인지 확인 |
| `src/hooks/useRewardedAd.ts` | `declare const GoogleAdMob` 존재 확인 |
| `package.json` | 버전 번호 확인 |

---

## 🔄 빌드 성공 후 할 일

1. **빌드 파일 확인**
   ```powershell
   Get-ChildItem "todays-match.ait" | Select-Object Name, Length, LastWriteTime
   ```

2. **변경사항 커밋**
   ```powershell
   git add .
   git commit -m "build: v1.0.x 빌드 완료"
   git push
   ```

3. **토스 콘솔 업로드**
   - 버전 관리 > 새 버전 만들기 > .ait 파일 업로드

---

*마지막 업데이트: 2026-01-18*
