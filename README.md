# SecondHand Platform Frontend

중고 거래와 경매 기능을 함께 제공하는 플랫폼의 프론트엔드 프로젝트입니다.

일반 상품 거래와 경매 상품 거래를 하나의 서비스 흐름 안에서 제공하며,  
상품 등록, 상품 조회, 입찰, 찜, QnA, 마이페이지 등 거래 전후의 사용자 흐름을 구현했습니다.

---

## 프로젝트 소개

SecondHand Platform은 일반 중고거래와 경매 거래를 함께 지원하는 서비스입니다.

사용자는 일반 상품을 고정 가격으로 등록하거나, 경매 상품을 등록해 입찰을 받을 수 있습니다.  
이 프로젝트에서 프론트엔드는 상품 유형과 경매 상태에 따라 가격 표시, 버튼 상태, 안내 문구, 입력 폼을 다르게 구성하는 데 집중했습니다.

또한 Swagger/API 명세를 기준으로 상품, 경매, 인증, 입찰, 찜, QnA, 유저 도메인의 타입과 service 계층을 분리해 API 연동 구조를 정리했습니다.

---

## 주요 기능

### 사용자 기능

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

### 상품 관리 기능

- 상품 수정
- 상품 삭제
- 상품 상태 표시
- 상품 이미지 표시
- 검색 / 카테고리 / 상태 필터
- 상품 카드 찜 수 표시
- 경매 상품 남은 시간 표시

---

## 거래 / 경매 정책

### 일반 상품

일반 상품은 `isAuction = false` 기준으로 처리합니다.

- 고정 가격 표시
- 일반 상품 상세 UI 사용
- 구매 가능 상태 표시
- 일반 판매 상품 수정 정책 적용

```ts
isAuction: false
```

### 경매 상품

경매 상품은 `isAuction = true` 기준으로 처리합니다.

- 시작가 기준 입찰 진행
- 현재 입찰가 표시
- 즉시 구매가 선택 제공
- 경매 시작 시간 / 종료 시간 표시
- 경매 상태에 따라 버튼과 안내 문구 변경

```ts
isAuction: true
```

---

## 경매 상태

경매 상태는 시간과 입찰 여부를 기준으로 구분합니다.

| 상태 | 의미 | UI 처리 |
| --- | --- | --- |
| READY | 시작 시간 이전 | 경매 시작 전, 입찰 불가 |
| RUNNING | 시작 ~ 종료 사이 | 경매 진행 중, 입찰 가능 |
| FINISHED | 정상 종료 | 경매 종료, 입찰 불가 |
| FAILED | 입찰자 없이 종료 | 유찰 표시 |
| CANCELLED | 경매 취소 | 취소된 경매 표시 |

```ts
type AuctionStatus = 'READY' | 'RUNNING' | 'FINISHED' | 'FAILED' | 'CANCELLED'
```

### 입찰 UX

- 현재 입찰가보다 낮은 금액 입력 불가
- 경매 진행 중일 때만 입찰 가능
- 경매 종료 후에는 입찰 버튼 비활성화
- 입찰 성공 시 현재가 갱신

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS / Global CSS |
| API | Service 기반 API 연동 |
| Auth | JWT 기반 인증 |
| Image | 이미지 업로드 정책 고려 |

---

## 핵심 구현

### 1. 일반 거래와 경매 거래 분리

상품 타입을 `isAuction` 기준으로 구분하고,  
일반 상품과 경매 상품의 화면 흐름을 다르게 구성했습니다.

일반 상품은 고정 가격과 판매 상태가 중요하고,  
경매 상품은 현재 입찰가, 시작 시간, 종료 시간, 남은 시간, 경매 상태가 중요합니다.

```tsx
if (product.isAuction) {
  return <AuctionDetail product={product} />
}

return <ProductDetail product={product} />
```

---

### 2. 경매 상태별 UI 처리

경매 상품은 `READY`, `RUNNING`, `FINISHED`, `FAILED`, `CANCELLED` 상태에 따라 버튼과 안내 문구가 달라집니다.

```ts
function getAuctionStatusLabel(status: AuctionStatus) {
  switch (status) {
    case 'READY':
      return '경매 시작 전'
    case 'RUNNING':
      return '경매 진행 중'
    case 'FINISHED':
      return '경매 종료'
    case 'FAILED':
      return '유찰'
    case 'CANCELLED':
      return '경매 취소'
    default:
      return '상태 확인 필요'
  }
}
```

상태별로 사용자가 가능한 행동도 다르게 처리했습니다.

| 상태 | 입찰 버튼 | 안내 문구 |
| --- | --- | --- |
| READY | 비활성화 | 경매 시작 전 |
| RUNNING | 활성화 | 현재 입찰 가능 |
| FINISHED | 비활성화 | 경매 종료 |
| FAILED | 비활성화 | 유찰 |
| CANCELLED | 비활성화 | 취소된 경매 |

---

### 3. 상품 카드 공통화

전체 상품, 경매장, 마이페이지 등 여러 화면에서 공통으로 사용할 수 있도록  
상품 카드 컴포넌트를 기준으로 목록 UI를 정리했습니다.

카드에서 공통으로 보여주는 정보는 다음과 같습니다.

- 상품명
- 가격 또는 현재 입찰가
- 썸네일
- 찜 수
- 경매 상태
- 남은 시간
- 카테고리

이를 통해 상품 목록, 홈 화면, 마이페이지의 UI를 일관되게 유지하고, 반복되는 카드 UI를 재사용할 수 있도록 했습니다.

---

### 4. 판매 등록 폼 분기

판매 등록 페이지에서 일반 상품과 경매 상품을 선택할 수 있도록 구성했습니다.

일반 상품은 고정 가격을 입력하고,  
경매 상품은 시작가, 시작 시간, 종료 시간 등 경매에 필요한 값을 입력합니다.

```text
판매 방식 선택
  ├─ 일반 상품
  │   └─ 가격 입력
  └─ 경매 상품
      ├─ 시작가 입력
      ├─ 시작 시간 입력
      └─ 종료 시간 입력
```

판매 방식에 따라 필요한 입력값이 다르기 때문에, 같은 판매 등록 페이지 안에서 폼 구조와 검증 기준을 다르게 구성했습니다.

---

### 5. 검색 / 카테고리 / 상태 필터

상품 목록과 경매장 화면에서 검색, 카테고리, 상태 필터를 함께 사용할 수 있도록 구성했습니다.

- 키워드 검색
- 카테고리 필터
- 상품 상태 필터
- 경매 상태 필터

필터 조건은 한 가지씩만 적용되는 것이 아니라, 검색어와 카테고리, 상태 조건이 함께 적용될 수 있도록 설계했습니다.

---

### 6. 로그인 사용자 보호 흐름

마이페이지, 판매 등록, 찜, 입찰 등 로그인 사용자 기능은 인증 상태를 기준으로 접근을 제어했습니다.

- 비로그인 사용자는 로그인 페이지 또는 로그인 안내로 이동
- 로그인 상태에 따라 Header UI 변경
- Sell Page 접근 보호
- MyPage 접근 보호
- 로그인 사용자 기준 내 정보 표시

---

### 7. API 명세 기반 service / type 분리

Swagger 명세를 기준으로 도메인별 타입과 API service를 먼저 정리했습니다.

페이지나 컴포넌트에서 직접 API 요청을 작성하지 않고, 도메인별 service 함수를 호출하는 구조를 사용했습니다.

```text
Page / Component
        ↓
Service
        ↓
lib/api.ts
        ↓
Backend API
```

이 구조를 사용한 이유는 다음과 같습니다.

- API endpoint 변경 시 수정 범위 축소
- 페이지 컴포넌트는 화면 상태와 사용자 액션에 집중
- 도메인별 API 책임 분리
- Swagger 명세와 TypeScript 타입 연결
- 백엔드 응답 구조 변경에 대응하기 쉬운 구조

---

### 8. 경매 상품 수정 / 취소 정책 정리

경매 상품은 일반 상품처럼 언제든 자유롭게 수정하거나 취소하기 어렵습니다.

이미 입찰이 시작된 상품의 가격, 이미지, 시작 시간 등이 바뀌면 입찰자의 신뢰에 영향을 줄 수 있기 때문에, 경매 상태에 따라 수정 가능 범위와 취소 가능 조건을 다르게 정리했습니다.

#### 상품 수정 정책

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

#### 경매 취소 정책

```text
READY
- 취소 가능

RUNNING
- 경매 시작 후 1시간 이내 취소 가능
- 1시간 이후 취소 불가

FINISHED / FAILED / CANCELLED
- 취소 불가
```

---

## 프로젝트 구조

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
├─ lib
│  ├─ api.ts
│  ├─ auction-ui.ts
│  ├─ format.ts
│  └─ storage.ts
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
└─ public
```

---

## 실행 방법

```bash
npm install
npm run dev
```

---

## 환경 변수

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

배포 환경에서는 운영 API 서버 주소를 사용합니다.

---

## Build

```bash
npm run build
```
