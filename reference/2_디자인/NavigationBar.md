---
url: >-
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/NavigationBar.md
---

# 내비게이션 바 설정

내비게이션 바는 화면 상단에 고정되어 있는 공통 UI 컴포넌트예요.\
이 문서에서는 **오른쪽 액세서리 영역에 아이콘을 추가하는 방법**과 **왼쪽 영역에 홈 버튼을 추가하는 방법** 두 가지를 설명해요.

## 디자인 가이드

상단 내비게이션은 사용자에게 일관된 정보 구조를 전달하기 위해 **모노톤 아이콘**만을 사용해요.\
컬러 아이콘은 시각적 주의를 과도하게 분산시키고, 불필요한 강조로 혼란을 줄 수 있기 때문이에요.\
토스에서는 기능 중심의 통일된 인터페이스를 위해,\
특수한 케이스를 제외하고는 모두 **모노톤 아이콘으로 통일**해 사용하고 있어요.

![](/assets/navi.BvEf_6ol.png)

## 1. 액세서리 아이콘 추가하기

게임, 비게임 미니앱 모두 우측 상단 **더보기 버튼 왼쪽 영역**에는 기능 버튼을 의미하는 아이콘을 한 개 추가할 수 있어요.

### 플랫폼별 설정 방식

* **WebView**
  * `partner.addAccessoryButton()`으로 런타임에 버튼을 추가할 수 있어요.
  * 클릭 이벤트는 `tdsEvent.addEventListener('navigationAccessoryEvent')`로 받아요.
  * 초기 노출은 `defineConfig`의 `navigationBar.initialAccessoryButton` 옵션을 사용해요.

* **React Native**
  * `useTopNavigation()`의 `addAccessoryButton()`으로 런타임에 버튼을 추가할 수 있어요.
  * 또는 `granite.config.ts`의 `navigationBar.initialAccessoryButton`을 사용해 초기 상태에서 버튼을 노출할 수 있어요.

### 시그니처

```typescript
interface NavigationBarOptions {
  withBackButton?: boolean; // 뒤로가기 버튼 유무
  withHomeButton?: boolean; // 홈버튼 유무
  initialAccessoryButton?: InitialAccessoryButton; // 1개만 노출 가능
}

interface InitialAccessoryButton {
  id: string;
  title?: string;
  icon: {
    name: string;
  };
}
```

### 예제

#### 아이콘 버튼 추가하기 (초기 설정)

::: code-group

```tsx [Web]
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
   // ...
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    initialAccessoryButton: {
      id: 'heart',
      title: 'Heart',
      icon: {
        name: 'icon-heart-mono',
      },
    }
  },
});
```

```tsx [React Native]
import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
   // ...
      navigationBar: {
        withBackButton: true,
        withHomeButton: true,
        initialAccessoryButton: {
          icon: {
            name: 'icon-heart-mono',
          },
          id: 'heart',
          title: '하트',
        },
      },
    }),
  ],
});
```

:::

#### 아이콘 추가하기 (동적 추가)

::: code-group

```js [js]
import { partner, tdsEvent } from '@apps-in-toss/web-framework'

partner.addAccessoryButton({
  id: 'heart',
  title: '하트',
  icon: {
    name: 'icon-heart-mono',
  },
});

const cleanup = tdsEvent.addEventListener('navigationAccessoryEvent', {
  onEvent: ({ id }) => {
    if (id === 'heart') {
      console.log('버튼 클릭');
    }
  },
});

window.addEventListener('pagehide', () => {
  cleanup();
});
```

```tsx [React]
import { partner, tdsEvent } from '@apps-in-toss/web-framework'
  // ...
  useEffect(() => {
    partner.addAccessoryButton({  // 하트 아이콘 버튼 추가
      id: 'heart',
      title: '하트',
      icon: {
        name: 'icon-heart-mono',
      },
    });

    // 네비게이션 액세서리 버튼 클릭 이벤트 리스너 등록
    const cleanup = tdsEvent.addEventListener('navigationAccessoryEvent', {
      onEvent: ({ id }) => {
        if (id === 'heart') {
          console.log('버튼 클릭');
        }
      },
    });

    return cleanup;
  }, []);
```

```tsx [React Native]
import { useTopNavigation } from '@apps-in-toss/framework';
import { tdsEvent } from '@toss/tds-react-native';

// ...
const { addAccessoryButton } = useTopNavigation();
  
addAccessoryButton({ // 하트 아이콘 버튼 추가
    title: '하트',
    icon: {
        name: 'icon-heart-mono',
    },
    id: 'heart',
    onPress: () => console.log('버튼 클릭'),
});


// 이벤트 리스너
 useEffect(() => {
    const cleanup = tdsEvent.addEventListener('navigationAccessoryEvent', {
      onEvent: ({ id }) => {
        if (id === 'heart') {
          console.log('heart 클릭됨');
        } 
      },
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      cleanup();
    };
  }, []);
```

:::

## 2. 홈 버튼 추가하기

비게임 미니앱에서는 왼쪽 상단에 **홈으로 이동하는 버튼**을 표시할 수 있어요.\
홈 버튼은 서비스 이름 오른쪽에 위치하며, 사용자가 언제든 첫 화면으로 돌아올 수 있도록 도와줘요.

::: tip 주의해주세요

* 오른쪽 액세서리 버튼 영역에는 홈 버튼을 중복 추가하지 말아주세요.
* 홈 버튼은 "서비스 진입점" 역할만 수행하며, 커스텀 기능이나 문구 추가는 불가능해요.
  :::

### 설정 방법

홈 버튼을 추가하려면 `navigationBar` 설정에 `withHomeButton: true` 옵션을 추가해 주세요.

```tsx
interface NavigationBarOptions {
  withHomeButton?: boolean; // 홈 버튼 표시 여부
}
```

### 예시

```tsx
navigationBar: {
  withBackButton: true,
  withHomeButton: true, // 홈 버튼 표시
}
```

## 참고사항

* 액세서리 버튼은 **모노톤 아이콘**만 지원돼요.
* 한 번에 표시할 수 있는 액세서리 버튼은 1개뿐이에요.
* 컬러 아이콘이나 커스텀 UI 추가는 지원하지 않아요.
* 홈 버튼은 비게임 미니앱에서만 사용 가능해요.
