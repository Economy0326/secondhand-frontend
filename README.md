# 🛍️ SecondHand Platform Frontend

중고 거래와 경매 기능을 함께 제공하는 플랫폼의 프론트엔드 프로젝트입니다.

일반 상품 거래와 경매 상품 거래를 하나의 서비스 흐름 안에서 제공하며,  
상품 등록, 상품 조회, 입찰, 찜, QnA, 마이페이지 등 거래 전후의 사용자 흐름을 구현했습니다.

이 프로젝트는 단순히 상품 목록과 상세 화면을 만드는 것보다, 일반 거래와 경매 거래가 함께 존재할 때 필요한 **상품 타입 분기, 경매 상태 처리, 입찰 가능 여부 판단, 판매 방식별 등록 폼 분기, API 연동 구조 분리**를 프론트엔드에서 일관되게 다루는 것에 중점을 두었습니다.

특히 중고거래는 판매자와 구매자 간의 신뢰가 중요한 서비스라고 판단해, 거래 중인 상품의 수정/취소 가능 범위를 명확히 정리하고, 반복 클릭이나 요청 지연으로 인한 상태 불일치를 줄이기 위해 pending 처리와 서버 상태 동기화 흐름을 함께 고려했습니다.

백엔드 API가 완전히 준비되기 전에도 주요 화면과 정책을 검증할 수 있도록 mock 상품 / mock 경매 데이터를 분리했고, 실제 API 연동 시 변경 범위를 줄이기 위해 도메인별 service layer와 type을 분리했습니다.

---

## 🧰 Tech Stack

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS / Global CSS |
| Routing | Next.js App Router |
| API | Fetch 기반 API Client, Service Layer |
| Auth | JWT Access Token / sessionStorage |
| Test | Vitest / Testing Library / jsdom |
| Image | 상품 이미지 업로드 정책 고려 |
| Build | Next.js |

---

## ✨ 주요 기능

### 👤 사용자 기능

- 회원가입 / 로그인
- 전체 상품 조회
- 일반 상품 상세 조회
- 경매 상품 상세 조회
- 상품 등록
- 일반 거래 / 경매 거래 선택 등록
- 입찰
- 찜
- QnA
- 마이페이지
  - 내 등록 상품
  - 내 입찰 목록
  - 내 찜 목록
  - 내 QnA

### 📦 상품 기능

- 상품 수정
- 상품 삭제
- 상품 상태 표시
- 상품 이미지 표시
- 검색 / 카테고리 / 상태 필터
- 상품 카드 찜 수 표시
- 일반 상품 / 경매 상품 카드 구분
- 경매 상품 남은 시간 표시

### 🔨 경매 기능

- 경매 시작가 / 현재가 / 즉시 구매가 표시
- 경매 시작일 / 종료일 표시
- 경매 상태별 UI 처리
- 입찰 가능 여부 검증
- 최고 입찰가 기준 입찰 금액 검증
- 판매자 본인 입찰 방지
- 경매 상태에 따른 버튼 / 안내 문구 분기

---

## 🖼️ 주요 화면

### 🏠 홈

<img src="./docs/screens/home.png" width="900" alt="Home" />

홈 화면에서는 서비스의 핵심 진입점을 제공합니다.

진행 중인 경매 상품을 강조하고, 전체 상품 목록과 경매장으로 이동할 수 있는 흐름을 제공합니다.  
또한 마감 임박 경매와 인기 상품 섹션을 통해 사용자가 일반 거래와 경매 거래를 자연스럽게 탐색할 수 있도록 구성했습니다.

---

### 🧺 상품 목록

<img src="./docs/screens/products.png" width="900" alt="Products" />

상품 목록 화면에서는 일반 판매 상품과 경매 상품을 함께 조회할 수 있습니다.

상품 상태, 카테고리, 키워드 검색 조건을 조합해 원하는 상품을 찾을 수 있도록 구성했고,  
상품 카드에서는 거래 방식, 찜 수, 가격 정보, 경매 상태를 함께 표시하도록 정리했습니다.

---

### ⏱️ 경매장

<img src="./docs/screens/auctions.png" width="900" alt="Auctions" />

경매장은 경매 상품만 모아서 탐색할 수 있는 화면입니다.

경매 상태와 카테고리를 기준으로 상품을 필터링할 수 있으며,  
진행 중 / 시작 전 / 종료 / 유찰 / 취소 상태에 따라 카드의 상태 표시와 안내 문구가 달라지도록 구성했습니다.

---

### 📦 일반 상품 상세

<img src="./docs/screens/product-detail.png" width="900" alt="Product detail" />

일반 상품 상세 화면에서는 상품 이미지, 판매자 정보, 판매가, 구매 및 찜 액션을 제공합니다.

일반 상품은 고정 가격을 중심으로 화면을 구성하고,  
하단에서는 상품에 대한 QnA를 작성하거나 조회할 수 있도록 흐름을 분리했습니다.

---

### 🔨 경매 상품 상세

<img src="./docs/screens/auction-detail.png" width="900" alt="Auction detail" />

경매 상품 상세 화면에서는 현재 입찰가, 시작 입찰가, 즉시 구매가, 경매 종료 시간과 남은 시간을 표시합니다.

경매가 진행 중일 때만 입찰 폼을 노출하고,  
로그인 여부, 판매자 본인 여부, 경매 상태, 입찰 금액 조건에 따라 입찰 가능 여부가 달라지도록 처리했습니다.

---

### 📝 일반 상품 등록

<img src="./docs/screens/sell-product.png" width="900" alt="Sell product" />

상품 등록 화면에서는 판매 방식을 선택해 일반 상품 또는 경매 상품을 등록할 수 있습니다.

일반 거래를 선택하면 판매가 입력 필드를 중심으로 폼을 구성하고,  
상품명, 카테고리, 설명, 이미지 업로드 정보를 함께 입력할 수 있도록 했습니다.

---

### 🏷️ 경매 상품 등록

<img src="./docs/screens/sell-auction.png" width="900" alt="Sell auction" />

경매 상품 등록 화면에서는 일반 상품 등록과 달리 시작 입찰가, 즉시 구매가, 경매 시작 시간, 경매 종료 시간을 입력합니다.

같은 등록 페이지 안에서 판매 방식에 따라 필요한 필드와 검증 기준이 달라지도록 폼 구조를 분기했습니다.

---

## 📌 핵심 문제

초기 구현에서는 일반 상품 목록과 경매 상품 목록을 각각 화면에 보여주는 것에 집중했습니다.

하지만 중고 거래와 경매 거래를 함께 지원하려면 단순 목록 조회보다 **같은 상품 도메인 안에서 일반 상품과 경매 상품을 어떻게 분기할 것인지**가 중요했습니다.

일반 상품은 고정 가격과 구매 흐름이 중요하고, 경매 상품은 현재 입찰가, 시작가, 즉시 구매가, 경매 시간, 경매 상태, 입찰 가능 여부가 중요했습니다.

또한 중고거래는 판매자와 구매자 간의 신뢰가 중요한 서비스이기 때문에, 거래 중인 상품이 임의로 수정되거나 취소될 경우 사용자 경험에 큰 영향을 줄 수 있다고 판단했습니다.

특히 경매 상품은 입찰자가 생긴 이후 가격, 이미지, 시작 시간 등이 바뀌면 거래 신뢰가 깨질 수 있기 때문에, 상품 상태에 따라 수정 가능 범위와 취소 가능 조건을 명확히 나누어야 했습니다.

그리고 찜, 입찰, 상품 등록/수정처럼 사용자가 빠르게 반복 클릭할 수 있는 기능에서는 요청 중복이나 화면 상태 불일치가 발생할 수 있어, pending 상태 처리와 서버 응답 이후 상태 동기화 흐름도 함께 고려했습니다.

그래서 이 프로젝트에서는 **상품 타입 분기, 경매 상태 처리, 입찰 정책 분리, 거래 중 수정/취소 정책, pending 처리, API service 계층 분리**를 핵심 문제로 잡았습니다.

---

## 🧭 서비스 흐름

```mermaid
flowchart TD
    A[사용자 진입] --> B[홈 화면]
    B --> C[상품 목록]
    B --> D[경매장]
    C --> E{상품 타입}
    D --> F[경매 상품 상세]

    E -->|일반 상품| G[일반 상품 상세]
    E -->|경매 상품| F

    G --> H[구매 / 찜 / QnA]
    F --> I{입찰 가능 여부}
    I -->|가능| J[입찰 진행]
    I -->|불가| K[상태별 안내 표시]

    B --> L[상품 등록]
    L --> M{판매 타입}
    M -->|일반 판매| N[일반 상품 등록]
    M -->|경매 판매| O[경매 상품 등록]
```

---

## 🔁 일반 거래 / 경매 거래 분기

일반 상품과 경매 상품은 같은 상품 도메인에 속하지만, 화면에서 보여줘야 하는 정보와 사용자 액션이 다릅니다.

일반 상품은 고정 가격과 판매 상태를 중심으로 보여주고,  
경매 상품은 현재 입찰가, 시작가, 즉시 구매가, 경매 시간, 경매 상태를 중심으로 보여줍니다.

```tsx
if (auction) {
  return <AuctionDetail product={product} auction={auction} />;
}

return <ProductDetail product={product} />;
```

```mermaid
flowchart TD
    A[상품 상세 진입] --> B[상품 정보 조회]
    B --> C[상품 ID 기준 경매 정보 조회]
    C --> D{경매 정보 존재 여부}

    D -->|없음| E[일반 상품 상세 UI]
    D -->|있음| F[경매 상품 상세 UI]

    E --> E1[판매가 표시]
    E --> E2[구매 / 찜 액션]
    E --> E3[QnA 영역]

    F --> F1[현재 입찰가 표시]
    F --> F2[시작가 / 즉시 구매가 표시]
    F --> F3[경매 시간 표시]
    F --> F4[입찰 가능 여부 검증]
```

---

## 🔨 경매 상태 처리

경매 상태는 시간과 입찰 여부를 기준으로 구분합니다.

| 상태 | 의미 | UI 처리 |
| --- | --- | --- |
| `READY` | 시작 시간 이전 | 경매 시작 전, 입찰 불가 |
| `RUNNING` | 시작 ~ 종료 사이 | 경매 진행 중, 입찰 가능 |
| `FINISHED` | 정상 종료 | 경매 종료, 입찰 불가 |
| `FAILED` | 입찰자 없이 종료 | 유찰 표시 |
| `CANCELLED` | 경매 취소 | 취소된 경매 표시 |

```ts
type AuctionStatus = "READY" | "RUNNING" | "FINISHED" | "FAILED" | "CANCELLED";
```

경매 상태에 따라 버튼 활성화 여부와 안내 문구가 달라지도록 처리했습니다.

```ts
function getAuctionStatusLabel(status: AuctionStatus) {
  switch (status) {
    case "READY":
      return "경매 시작 전";
    case "RUNNING":
      return "경매 진행 중";
    case "FINISHED":
      return "경매 종료";
    case "FAILED":
      return "유찰";
    case "CANCELLED":
      return "경매 취소";
    default:
      return "상태 확인 필요";
  }
}
```

---

## 💰 입찰 정책

입찰 가능 여부는 단순히 경매가 진행 중인지 여부만으로 판단하지 않습니다.

다음 조건을 함께 확인합니다.

- 현재 입찰가보다 높은 금액인지 여부
- 즉시 구매가가 있는 경우 즉시 구매가를 초과하지 않는지 여부
- 경매 상태가 `RUNNING`인지 여부
- 로그인한 사용자인지 여부
- 판매자 본인이 아닌지 여부

```mermaid
flowchart TD
    A[경매 상품 상세] --> B{경매 상태}
    B -->|READY| C[시작 예정 안내]
    B -->|RUNNING| D{입찰 가능 조건 확인}
    B -->|FINISHED| E[경매 종료 안내]
    B -->|FAILED| F[유찰 안내]
    B -->|CANCELLED| G[경매 취소 안내]

    D --> H{로그인 여부}
    H -->|비로그인| I[로그인 필요 안내]
    H -->|로그인| J{판매자 본인 여부}
    J -->|판매자| K[본인 상품 입찰 불가]
    J -->|구매자| L[입찰 금액 검증]
    L --> M{금액 조건 통과}
    M -->|통과| N[입찰 가능]
    M -->|실패| O[검증 문구 표시]
```

입찰 금액 검증과 입찰 가능 여부 판단 로직은 `lib/auction-policy.ts`로 분리했습니다.

이를 통해 UI 컴포넌트는 정책 결과만 사용하고, 정책이 변경될 때는 정책 파일과 테스트만 수정할 수 있도록 구성했습니다.

---

## 📝 판매 등록 폼 분기

판매 등록 페이지에서는 일반 상품과 경매 상품을 같은 페이지에서 등록할 수 있습니다.

일반 상품은 고정 가격을 입력하고,  
경매 상품은 시작가, 즉시 구매가, 시작 시간, 종료 시간 등 경매에 필요한 값을 입력합니다.

```text
판매 방식 선택
  ├─ 일반 상품
  │   └─ 판매가 입력
  └─ 경매 상품
      ├─ 시작가 입력
      ├─ 즉시 구매가 입력
      ├─ 경매 시작 시간 입력
      └─ 경매 종료 시간 입력
```

판매 방식에 따라 필요한 입력값과 검증 기준이 다르기 때문에,  
같은 등록 페이지 안에서 폼 구조를 분기했습니다.

---

## 🔍 검색 / 필터 처리

상품 목록과 경매장 화면에서는 검색, 카테고리, 상태 필터를 함께 사용할 수 있도록 구성했습니다.

- 키워드 검색
- 카테고리 필터
- 상품 상태 필터
- 경매 상태 필터

검색어, 카테고리, 상태 조건이 함께 적용될 수 있도록 query 생성 로직을 분리했습니다.

---

## 🧱 API 요청 구조

페이지와 컴포넌트에서 직접 API 요청을 작성하지 않고, 도메인별 service 함수가 공통 API client를 호출하도록 구성했습니다.

```text
Page / Component
        ↓
Service
        ↓
lib/api.ts
        ↓
Backend API
```

`lib/api.ts`는 공통 요청 처리를 담당합니다.

- API base URL 구성
- Authorization Header 구성
- JSON 요청 / 응답 처리
- 인증 실패 응답 처리
- FormData 요청 처리

이 구조를 사용한 이유는 다음과 같습니다.

- API endpoint 변경 시 수정 범위 축소
- 페이지 컴포넌트는 화면 상태와 사용자 액션에 집중
- 도메인별 API 책임 분리
- Swagger 명세와 TypeScript 타입 연결
- 백엔드 응답 구조 변경에 대응하기 쉬운 구조

---

## 🧪 mock 데이터 기반 화면 검증

백엔드 API가 완전히 준비되지 않은 상태에서도 프론트엔드 화면과 정책을 검증할 수 있도록 상품 mock 데이터와 경매 mock 데이터를 분리했습니다.

```env
NEXT_PUBLIC_USE_MOCK_PRODUCTS=true
NEXT_PUBLIC_USE_MOCK_AUCTIONS=true
```

mock 데이터 기준으로 다음 화면을 백엔드 없이 확인할 수 있습니다.

| 화면 | 경로 |
| --- | --- |
| 홈 | `/` |
| 상품 목록 | `/products` |
| 경매장 | `/auctions` |
| 일반 상품 상세 | `/products/1` |
| 경매 상품 상세 | `/products/4` |
| 상품 등록 | `/sell` |

상품 등록 화면은 로그인 사용자 전용 페이지이므로, 화면 캡처 시에는 브라우저 콘솔에서 임시 세션을 넣어 확인했습니다.

```js
sessionStorage.setItem("accessToken", "mock-token");
sessionStorage.setItem("user", JSON.stringify({
  accessToken: "mock-token",
  tokenType: "Bearer",
  userId: 999,
  email: "mock@example.com",
  name: "Mock User",
  nickname: "mock_user"
}));

window.dispatchEvent(new Event("auth-change"));
```

---

## 🛠️ 거래 신뢰를 위한 수정 / 취소 정책

중고거래는 판매자와 구매자 간의 신뢰가 중요한 서비스입니다.

특히 경매 상품은 입찰자가 존재할 수 있기 때문에, 거래가 진행 중인 상태에서 판매자가 가격, 이미지, 시작 시간 등을 자유롭게 수정하면 입찰자의 판단 기준이 달라질 수 있습니다.

그래서 일반 판매 상품과 경매 상품의 수정 가능 범위를 분리하고, 경매 상품은 상태에 따라 수정 / 취소 가능 조건을 다르게 정리했습니다.

### 상품 수정 정책

```text
일반 판매 상품
- title, description, category, buyNowPrice, images 수정 가능

경매 상품

READY
- title, description, category, startPrice, buyNowPrice,
  auctionStartTime, auctionEndTime, images 수정 가능

RUNNING
- title, description, auctionEndTime 수정 가능
- auctionEndTime은 뒤로만 연장 가능
- startPrice, buyNowPrice, images 수정 불가

FINISHED / FAILED / CANCELLED
- 수정 불가
```

### 경매 취소 정책

```text
READY
- 취소 가능

RUNNING
- 경매 시작 후 1시간 이내 취소 가능
- 1시간 이후 취소 불가

FINISHED / FAILED / CANCELLED
- 취소 불가
```

### pending / 동기화 처리

입찰, 찜, 상품 등록/수정처럼 사용자가 빠르게 반복 클릭할 수 있는 기능은 중복 요청과 화면 상태 불일치가 발생할 수 있습니다.

이를 줄이기 위해 요청 중에는 버튼을 비활성화하거나 pending 상태를 표시하고, 서버 응답 이후 최신 상태를 다시 반영하는 흐름을 고려했습니다.

- 요청 중 버튼 중복 클릭 방지
- 입찰 요청 중 추가 입찰 방지
- 찜 요청 중 중복 토글 방지
- 등록 / 수정 요청 중 중복 제출 방지
- 서버 응답 이후 현재가, 찜 수, 상품 상태 동기화
- 실패 시 사용자에게 에러 메시지 표시 후 이전 상태 유지

수정/취소 가능 범위와 동기화 기준은 백엔드 개발자와 함께 정책을 맞추며 정리했습니다.

---

## 🧪 Test

경매 상품은 상태, 로그인 여부, 판매자 여부, 입찰 금액에 따라 입찰 가능 여부가 달라지고,  
검색 / 필터 조건은 API 요청 query string으로 변환되어야 하기 때문에 관련 로직을 별도 유틸 함수로 분리해 테스트했습니다.

### 테스트 대상

- 입찰 금액 검증 로직
  - 0원 이하 금액 입력 제한
  - 현재 입찰가 이하 금액 제한
  - 즉시 구매가 초과 금액 제한
  - 정상 입찰 금액 검증
- 입찰 가능 여부 판단 로직
  - 비로그인 사용자 입찰 제한
  - 판매자 본인 입찰 제한
  - `RUNNING` 상태에서만 입찰 가능
  - `READY` / `FINISHED` 상태 입찰 제한
- 경매 상태별 UI 문구 처리
  - 남은 시간 표시
  - 상태별 안내 문구
  - 상태별 가격 라벨
- 가격 포맷팅 로직
- 검색 / 필터 query 생성 로직

---

## 🧯 Troubleshooting / Lessons Learned

### 1. 일반 상품과 경매 상품을 같은 상품 도메인에서 처리하는 문제

| 항목 | 내용 |
| --- | --- |
| Problem | 일반 상품과 경매 상품은 같은 상품 목록과 상세 페이지를 공유하지만, 화면에서 보여줘야 하는 정보와 액션이 달랐습니다. |
| Cause | 일반 상품은 고정 가격과 구매 흐름이 중요하고, 경매 상품은 현재 입찰가, 시작가, 즉시 구매가, 경매 시간, 경매 상태, 입찰 가능 여부가 중요했습니다. |
| Fix | 상품 상세 진입 시 상품 정보를 먼저 조회하고, 상품 ID 기준으로 경매 정보를 추가 조회했습니다. 경매 정보가 있으면 경매 상세 UI를, 없으면 일반 상품 상세 UI를 렌더링하도록 분기했습니다. |
| Result | 같은 상품 상세 페이지 안에서 일반 거래와 경매 거래를 함께 처리하면서도, 화면 정책은 명확하게 분리할 수 있었습니다. |

### 2. 반복 클릭과 서버 상태 동기화로 인한 UI 불일치 문제

| 항목 | 내용 |
| --- | --- |
| Problem | 입찰, 찜, 상품 등록/수정처럼 사용자가 빠르게 반복 클릭할 수 있는 기능에서 중복 요청이나 화면 상태 불일치가 발생할 수 있었습니다. |
| Cause | 요청이 완료되기 전에 같은 액션이 다시 실행되면 프론트엔드 상태와 서버 상태가 서로 달라질 수 있고, 특히 입찰이나 찜처럼 수치가 바로 바뀌는 기능에서는 사용자에게 잘못된 상태가 보일 수 있었습니다. |
| Fix | 요청 중에는 pending 상태를 두어 버튼을 비활성화하거나 중복 제출을 막고, 서버 응답 이후 최신 데이터를 기준으로 화면 상태를 갱신하도록 정리했습니다. 또한 거래 중 상품의 수정/취소 가능 범위는 백엔드 개발자와 함께 정책을 맞춰 상태별 기준을 명확히 했습니다. |
| Result | 반복 클릭으로 인한 중복 요청 가능성을 줄이고, 입찰가, 찜 수, 상품 상태처럼 서버와 맞아야 하는 데이터는 응답 이후 동기화하는 흐름으로 정리할 수 있었습니다. |

---

## 📁 프로젝트 구조

```text
secondhand-frontend
├─ app
│  ├─ auctions
│  ├─ login
│  ├─ mypage
│  ├─ products
│  ├─ sell
│  ├─ signup
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ components
│  ├─ auction
│  ├─ common
│  ├─ home
│  ├─ layout
│  └─ product
│
├─ constants
│  ├─ auction.ts
│  ├─ category.ts
│  └─ product-status.ts
│
├─ docs
│  └─ screens
│     ├─ home.png
│     ├─ products.png
│     ├─ auctions.png
│     ├─ product-detail.png
│     ├─ auction-detail.png
│     ├─ sell-product.png
│     └─ sell-auction.png
│
├─ lib
│  ├─ api.ts
│  ├─ auction-policy.ts
│  ├─ auction-ui.ts
│  ├─ format.ts
│  ├─ product-query.ts
│  └─ storage.ts
│
├─ mocks
│  ├─ auctions.mock.ts
│  └─ products.mock.ts
│
├─ public
│  └─ mock
│     ├─ product-denim.jpg
│     ├─ product-keyboard.jpg
│     ├─ product-headphone.jpg
│     ├─ product-camera.jpg
│     ├─ product-camping.jpg
│     ├─ product-shoes.jpg
│     └─ hero-watch.jpg
│
├─ services
│  ├─ auction.service.ts
│  ├─ auth.service.ts
│  ├─ bid.service.ts
│  ├─ like.service.ts
│  ├─ product.service.ts
│  ├─ qna.service.ts
│  └─ user.service.ts
│
├─ types
│  ├─ auction.ts
│  ├─ auth.ts
│  ├─ bid.ts
│  ├─ like.ts
│  ├─ product.ts
│  ├─ qna.ts
│  └─ user.ts
│
├─ __tests__
│  ├─ auction-policy.test.ts
│  ├─ auction_ui.test.ts
│  ├─ format.test.ts
│  └─ product-query.test.ts
│
├─ README.md
├─ package.json
├─ next.config.ts
├─ tsconfig.json
└─ vitest.config.ts
```

```text
docs
└─ screens
   ├─ home.png
   ├─ products.png
   ├─ auctions.png
   ├─ product-detail.png
   ├─ auction-detail.png
   ├─ sell-product.png
   └─ sell-auction.png
```

---

## 🔧 환경 변수

`.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_PRODUCTS=true
NEXT_PUBLIC_USE_MOCK_AUCTIONS=true
```

mock 데이터를 사용하지 않고 실제 백엔드 API를 사용할 경우 다음처럼 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_PRODUCTS=false
NEXT_PUBLIC_USE_MOCK_AUCTIONS=false
```

---

## 🚀 실행 방법

```bash
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

---

## 🧪 Test

```bash
npm test
```

또는

```bash
npm run test:run
```