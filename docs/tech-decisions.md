# Tech Decisions

## 1. TanStack Query 도입

### 도입 이유

마이페이지, 찜, 입찰, 경매 만료 흐름처럼 서버 상태를 여러 화면에서 공유해야 하는 기능이 늘어나면서 직접 `useState`와 `useEffect`만으로 데이터를 관리하기 어려워졌다.

TanStack Query를 도입해 서버 상태를 다음 기준으로 관리한다.

- 서버에서 가져온 목록/상세 데이터 캐싱
- mutation 성공 후 관련 query invalidate
- 찜 optimistic update
- 입찰은 서버 검증 기준 유지

### 적용 범위

TanStack Query가 맡는 데이터:

- 내 등록 상품
- 내 찜 목록
- 내 입찰 목록
- 내 QnA 목록
- 찜 여부
- 찜 수
- 입찰 mutation 후 경매/상품 관련 데이터 갱신

TanStack Query가 맡지 않는 데이터:

- 모달 open/close
- toast message
- 마이페이지 active tab
- header 로그인 표시 상태

이런 클라이언트 UI 상태는 Zustand가 맡는다.

## 2. Query Key Factory

query key가 파일마다 흩어지면 invalidate 대상이 불명확해진다.

따라서 `lib/query-keys.ts`에서 query key를 중앙 관리한다.

예시:

```ts
queryKeys.product(productId);
queryKeys.auctionByProduct(productId);
queryKeys.myLikes;
queryKeys.myBids;
```

이 구조를 통해 mutation 이후 invalidate 대상이 명확해진다.

## 3. 찜 Mutation 전략

찜은 optimistic update를 적용한다.

이유:

- 사용자가 버튼을 눌렀을 때 즉시 반응해야 한다.
- 실패 시 이전 상태로 rollback할 수 있다.
- 최종 like count는 invalidate 이후 서버 응답으로 다시 맞출 수 있다.

무효화 대상:

- products
- product detail
- myLikes
- product like status
- product like count

## 4. 입찰 Mutation 전략

입찰은 optimistic update를 적용하지 않는다.

이유:

- 현재가
- 최고 입찰자
- 입찰 가능 여부
- 즉시 구매가 도달 여부
- 경매 종료 여부

이 값들은 서버 검증 결과가 기준이어야 한다.

입찰 성공 후에는 관련 query를 invalidate하고, 서버 컴포넌트 데이터 갱신이 필요한 상세 화면에서는 `router.refresh()`를 함께 사용한다.

## 5. 경매 만료 처리

Countdown이 0초가 되었을 때 프론트에서 sync API를 직접 호출하지 않는다.

대신 관련 query를 invalidate하고, 백엔드가 조회 응답 전에 경매 상태를 최신화한다는 흐름을 기준으로 한다.

상세 페이지 기준 invalidate 대상:

- auctionByProduct
- product

목록 페이지 기준 invalidate 대상:

- auctions

## 6. Zustand 도입

Zustand는 서버 상태가 아니라 클라이언트 UI 상태만 담당한다.

담당 상태:

- header auth 표시 상태
- modal open/close
- toast message
- mypage active tab

담당하지 않는 상태:

- 상품 목록
- 경매 목록
- 찜 목록
- 입찰 목록
- 상품 상세
- 경매 상세

이 데이터는 TanStack Query 또는 서버 컴포넌트 조회가 담당한다.

## 7. Rendering Strategy

### `/products`

검색 조건을 `searchParams`로 받아 서버에서 조회한다.

### `/auctions`

검색 조건 기반 서버 조회를 유지한다. Countdown과 만료 invalidate는 client component에서 처리한다.

### `/products/[id]`

상품 기본 정보와 경매 기본 정보는 서버에서 조회한다.

사용자 상호작용이 필요한 영역은 client component로 분리한다.

- LikeButton
- BidForm
- QnaSection
- ProductOwnerActions
- AuctionExpirationRefetch

### `/sell`

상품 등록 폼은 입력 상태와 이미지 업로드 상태가 많기 때문에 CSR로 유지한다.

### `/mypage`

로그인 사용자 기준 데이터 조회와 탭 전환이 있으므로 CSR + TanStack Query + Zustand 조합으로 유지한다.

### `/products/[id]/edit`

상품 수정 폼, 이미지 추가/삭제 예정 처리, 수정 가능 정책 분기가 많으므로 CSR로 유지한다.

### `/`

정적 소개와 탐색 중심이면 SSG/ISR 후보로 유지한다. 실시간 인기 상품이나 경매 데이터가 들어가면 dynamic rendering을 검토한다.

## 8. Web Vitals

Web Vitals 측정을 위해 `useReportWebVitals` 기반 client component를 추가한다.

확인 지표:

- LCP
- INP
- CLS
- FCP
- TTFB

레이아웃 안정화를 위해 상품 카드 이미지, 상세 대표 이미지, countdown 영역의 공간을 미리 확보한다.