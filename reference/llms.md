---
url: 'https://developers-apps-in-toss.toss.im/development/llms.md'
description: >-
  IDE에서 AI가 더 정확한 코드를 생성할 수 있도록 컨텍스트 파일을 사용하는 방법을 안내합니다. llms.txt, 문서 URL, @docs
  기능을 활용하여 프로젝트 정보를 AI에게 주입해 보세요.
---

# LLMs 사용하기

AI가 프로젝트의 문맥을 이해하면 더 정확한 코드와 답변을 제공할 수 있어요.\
Cursor에서는 **문서(URL)** 또는 **llms.txt** 파일을 등록해 AI가 참고할 컨텍스트를 제공할 수 있습니다.

::: tip 왜 컨텍스트가 필요한가요?
AI는 기본적으로 프로젝트의 도메인 지식을 알고 있지 않아요.\
SDK 사용법, API 구조, 에러 규칙 등 필요한 정보를 함께 제공하면 **정확도**와 **일관성**이 크게 향상돼요.
:::

이 문서는 **Cursor IDE**를 기준으로 설명해요.\
VSCode 등 다른 IDE에서도 유사한 방식으로 활용할 수 있어요.

## 1. 문서 URL 등록하기 (@docs)

앱인토스 문서를 AI에 연결하려면 Cursor의 **Docs 인덱싱** 기능을 사용하세요.\
아래 단계에 따라 필요한 문서를 빠르게 등록할 수 있어요.

1. Cursor 화면 우측 상단의 **톱니바퀴(⚙️)** 아이콘을 클릭하세요.
2. 왼쪽 메뉴에서 **Indexing & Docs**를 선택하세요.
3. 화면 하단의 **Docs** 섹션으로 이동하세요.
4. `+Add Doc` 버튼을 클릭해 문서를 추가하세요.

### 추가할 수 있는 문서 URL

| 유형 | 설명 | URL |
|------|-------|------|
| **기본 문서 (권장)** | 앱인토스 기능을 사용하는 데 필요한 핵심 정보들이 포함돼 있어요. | `https://developers-apps-in-toss.toss.im/llms.txt` |
| **모든 기능 포함 문서 (Full)** | 전체 문서를 포함한 확장 버전이에요.컨텍스트는 풍부하지만 **토큰 소모량이 증가**할 수 있어요. | `https://developers-apps-in-toss.toss.im/llms-full.txt` |
| **예제 전용 문서** | 앱인토스 예제 코드만 빠르게 참고하고 싶을 때 사용해요. | `https://developers-apps-in-toss.toss.im/tutorials/examples.md` |
| **TDS 문서 (WebView)** | TDS WebView 관련 정보가 포함돼 있어요. | `https://tossmini-docs.toss.im/tds-mobile/llms-full.txt` |
| **TDS 문서 (React Native)** | TDS React Native 정보가 포함돼 있어요. | `https://tossmini-docs.toss.im/tds-react-native/llms-full.txt` |

![llms-1](/assets/llms-1.Ddl9380t.png)

## 2. 문서를 기반으로 AI 활용하기

문서를 등록하면 AI가 해당 문서를 기반으로 더 정확한 답변을 생성할 수 있어요.\
특히 Cursor에서는 `@docs` 명령을 사용하여 *지정된 문서를 우선적으로 참고*하도록 요청할 수 있어요.

```
@docs 앱인토스 인앱광고 샘플 코드 작성해줘
```

::: tip @docs는 언제 사용하나요?

* SDK처럼 **정확한 규칙 기반 코드**가 필요한 경우
* 문서 기반 의존도가 높은 기능을 사용할 때
* AI에게 “문서를 기반으로 답변해 달라”고 명확히 전달하고 싶을 때\
  `@docs`를 사용하면 AI는 문서를 우선적으로 참고해 더 안정적인 답변을 제공합니다.
  :::

AI는 `@docs` 없이도 문서를 자동으로 참고하지만,\
**정밀한 문맥 이해가 필요할 때는 `@docs`를 사용해 명시적으로 지시하는 것이 좋아요.**

## 3. 곧 추가될 기능 : MCP(Model Context Protocol)

곧 Cursor에서 **MCP(Model Context Protocol)** 도 지원될 예정이에요.\
MCP가 적용되면 문서, 설정, 리소스 등 다양한 프로젝트 맥락을 AI가 보다 정교하게 이해하고 활용할 수 있어,\
**복잡한 프로젝트에서도 더 안정적인 개발 경험**을 제공할 거예요.
