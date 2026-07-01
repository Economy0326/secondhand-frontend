# API Policy

이 문서는 중고거래 프로젝트에서 프론트엔드와 백엔드가 맞춰야 하는 API 정책을 정리한 문서입니다.

현재 문서에서는 경매 상태 동기화 정책과 상품 수정 이미지 정책을 다룹니다.

---

## 1. 경매 상태 동기화 정책

프론트엔드에서는 `PATCH /api/auctions/{auctionId}/sync` API를 일반 화면 로직에서 직접 호출하지 않습니다.

경매 상태 동기화는 백엔드에서 자동으로 처리합니다.

여기서 동기화 대상은 일반 상품이 아니라 경매입니다.

상품 조회 API에서 동기화를 한다는 의미는 일반 상품의 상태를 변경한다는 뜻이 아닙니다. 상품 응답에 포함된 경매 상품의 `auctionStatus`, `auctionStartTime`, `auctionEndTime` 등 경매 관련 정보를 현재 시간 기준으로 최신화한다는 뜻입니다.

예를 들어 `GET /api/products` 응답에는 일반 상품과 경매 상품이 함께 포함될 수 있습니다. 이때 일반 상품은 별도 동기화 대상이 아니며, 경매 상품에 대해서만 경매 상태를 최신 상태로 맞춘 뒤 응답합니다.

### 자동 동기화 대상 조회 API

아래 API를 호출하면 백엔드가 응답에 포함된 경매 상품의 상태를 먼저 동기화한 뒤 응답을 반환합니다.

```txt
GET /api/auctions
GET /api/auctions/status/{status}
GET /api/auctions/search?keyword=&status=&category=
GET /api/auctions/product/{productId}

GET /api/products
GET /api/products/{productId}
GET /api/products/status/{status}
GET /api/products/search?keyword=&status=&category=
GET /api/products/me

GET /api/likes/me
```

### 상태 전환 기준

```txt
현재 시간이 startTime 전이면 READY 유지

현재 시간이 startTime 이상이고 endTime 전이면
READY → RUNNING

현재 시간이 endTime 이상이면
RUNNING → FINISHED 또는 FAILED

입찰자가 있으면 FINISHED
입찰자가 없으면 FAILED

FINISHED, FAILED, CANCELLED 상태는 자동 동기화로 다시 변경하지 않음

즉시구매가 완료된 경우
경매는 FINISHED
상품은 SOLD
```

### PATCH /api/auctions/{auctionId}/sync 처리

`PATCH /api/auctions/{auctionId}/sync` API는 프론트엔드 일반 화면 로직에서 사용하지 않습니다.

해당 API는 예비용 또는 개발 확인용 API로 둡니다.

```txt
응답 body: AuctionResponse
이미 최신 상태라 변경할 내용이 없어도 200 OK
존재하지 않는 경매면 404 Not Found
CANCELLED 상태의 경매는 상태 변경 없이 현재 AuctionResponse 반환
프론트 화면 로직은 이 API 호출에 의존하지 않음
```

### 프론트엔드 처리 방식

프론트엔드는 목록, 상세, 검색 조회 API만 호출합니다.

```txt
경매장 목록 진입
→ GET /api/auctions
→ 또는 GET /api/auctions/search

상품 상세 진입
→ GET /api/products/{productId}
→ 경매 상품이면 필요 시 GET /api/auctions/product/{productId}

남은 시간이 0초가 된 경우
→ 해당 목록 또는 상세 데이터를 refetch

입찰 / 즉시구매 요청 시
→ 백엔드에서 현재 경매 상태를 최종 검증
```

프론트엔드에서는 카드마다 `sync` API를 호출하지 않습니다.

---

## 2. 상품 수정 이미지 정책

상품 수정 시 이미지는 “기존 이미지 유지가 기본, 삭제 / 추가 / 썸네일 변경은 명시적으로 요청”하는 방식으로 처리합니다.

### 기본 정책

```txt
PATCH /api/products/{productId} 요청에서 이미지 관련 값이 없으면 기존 이미지는 그대로 유지

새 이미지를 보내면 기존 이미지는 유지하고 새 이미지만 추가

기존 이미지를 삭제하려면 deleteImageIds로 삭제할 이미지 ID를 명시

썸네일을 변경하려면 thumbnailImageId로 썸네일로 사용할 기존 이미지 ID를 명시

삭제 후 이미지가 0장이 되면 400 Bad Request

최대 이미지 개수는 기존 상품 등록 정책과 동일하게 적용
```

### 요청 방식

상품 수정은 `multipart/form-data` 방식으로 처리합니다.

예상 필드:

```txt
title
description
category
buyNowPrice
deleteImageIds
thumbnailImageId
newImages
```

예시:

```http
PATCH /api/products/{productId}
Content-Type: multipart/form-data

title: 수정 제목
description: 수정 설명
category: 전자기기
buyNowPrice: 700000
deleteImageIds: [3]
thumbnailImageId: 2
newImages: File[]
```

### 썸네일 처리 정책

```txt
1. thumbnailImageId가 있으면 해당 기존 이미지를 썸네일로 지정

2. thumbnailImageId가 없으면 기존 썸네일 유지

3. 기존 썸네일이 deleteImageIds에 포함되어 삭제되는 경우
   - 남아 있는 기존 이미지가 있으면 그중 첫 번째 이미지를 썸네일로 지정
   - 남아 있는 기존 이미지가 없고 새 이미지가 있으면 새 이미지 중 첫 번째 이미지를 썸네일로 지정
   - 남은 이미지가 하나도 없으면 400 Bad Request

4. 새 이미지 중 특정 이미지를 썸네일로 직접 지정하는 기능은 1차 버전에서는 제외

5. 새 이미지만 추가되고 thumbnailImageId가 없으면 기존 썸네일 유지
```

### 상태별 이미지 수정 가능 여부

일반 판매 상품:

```txt
SALE: 이미지 수정 가능
SOLD: 이미지 수정 불가
```

경매 상품:

```txt
READY: 이미지 수정 가능
RUNNING: 이미지 수정 불가
FINISHED: 이미지 수정 불가
FAILED: 이미지 수정 불가
CANCELLED: 이미지 수정 불가
```

### 프론트엔드 이미지 수정 상태

프론트엔드는 기존 이미지, 삭제할 이미지, 새 이미지, 썸네일 이미지를 분리해서 관리합니다.

```ts
type ProductEditImageState = {
  existingImages: ProductImage[];
  deleteImageIds: number[];
  newImages: File[];
  thumbnailImageId: number | null;
};
```

이미지를 보내지 않으면 기존 이미지 유지로 처리하고, 사용자가 명시적으로 삭제한 이미지만 `deleteImageIds`에 담아 보냅니다.

삭제 버튼을 눌렀을 때 서버에 즉시 삭제 요청을 보내지 않고, 최종 submit 시 한 번의 `PATCH /api/products/{productId}` 요청으로 반영합니다.

---

## 3. 프론트엔드 기준 정리

프론트엔드는 아래 원칙을 따릅니다.

```txt
경매 상태 동기화는 조회 API 응답 기준으로 처리한다.

PATCH /api/auctions/{auctionId}/sync는 일반 화면에서 직접 호출하지 않는다.

일반 상품은 경매 상태 동기화 대상이 아니다.

상품 조회 API에서 동기화를 한다는 말은 응답에 포함된 경매 상품의 경매 정보를 최신화한다는 뜻이다.

남은 시간이 0초가 되면 sync API를 호출하지 않고 데이터를 refetch한다.

입찰 / 즉시구매 요청 시 최종 상태 검증은 백엔드에 맡긴다.

상품 수정 시 이미지는 기존 이미지 유지가 기본이다.

삭제 / 추가 / 썸네일 변경은 명시적인 필드로만 요청한다.

상품 수정 이미지 정책은 순수 함수로 분리해 테스트한다.
```