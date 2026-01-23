# 🔍 토스 공유 및 친구 초대 API 연구

## 1. 사용 가능한 API 옵션

### 1️⃣ `share(message)`
- **기능**: 단순히 텍스트(URL 포함)를 OS 네이티브 공유 시트(카톡, 문자 등 선택창)로 띄웁니다.
- **장점**: 구현이 쉽고 별도 설정 불필요.
- **단점**: 리워드 지급 불가능, 단순 텍스트 공유.
- **현재 구현**: 이 방식을 사용 중 (`https://toss.im` 등 URL 텍스트 공유).

### 2️⃣ `contactsViral(params)` (사용자 요청 기능)
- **기능**: 토스 앱 내 "친구 선택" 화면이 뜨고, 선택한 친구에게 메시지를 보냄 + **리워드 지급**.
- **필수 조건**: **`moduleId`** (토스 콘솔 > 미니앱 > 공유 리워드 메뉴에서 발급 필요).
- **장점**: 리워드를 줄 수 있어 확산(Viral) 효과가 큼.
- **사용 코드**:
  ```typescript
  import { contactsViral } from '@apps-in-toss/web-bridge';
  
  contactsViral({
    options: { moduleId: 'YOUR_MODULE_ID' }, // ⚠️ 필수
    onEvent: (event) => {
      if (event.type === 'sendViral') {
        console.log('리워드 지급:', event.data.rewardAmount);
      }
    }
  });
  ```

### 3️⃣ `getTossShareLink(path)`
- **기능**: 토스 앱을 열 수 있는 전용 링크 생성.
- **사용법**: `await getTossShareLink('intoss://my-app/path')`
- **필수 조건**: 앱의 딥링크 스킴(`intoss://...`)을 알아야 함.

---

## 2. 결론 및 제안

### ✅ 현재 상태 (v1.0.4)
- **`share` 함수 사용**: 현재 URL(또는 메인 URL)을 텍스트로 복사/공유.
- **문제점**: 친구 초대 보상(포인트 등)이 없음.

### 🚀 친구 초대(리워드) 기능 구현을 위한 Step
사용자(개발자)님께서 다음 정보를 확인해 주셔야 구현 가능합니다.

1.  **토스 개발자 콘솔** 접속
2.  **미니앱 > 공유 리워드** 메뉴 이동
3.  리워드 설정을 생성하고 **`moduleId`** (UUID 형식) 복사
4.  저에게 `moduleId`를 알려주시면 `share.ts`를 `contactsViral` 방식으로 업그레이드할 수 있습니다.

### 🔗 딥링크 (Deep Link) 확인
콘솔의 **배포 정보**에서 **앱 스킴(App Scheme)** 또는 **딥링크** 정보(`intoss://...`)를 알려주시면, `getTossShareLink`를 통해 더 자연스러운 앱 진입 링크를 만들 수 있습니다.
