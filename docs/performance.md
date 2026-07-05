# Performance Notes

## 목표

상품 목록과 경매 상세 화면에서 사용자가 체감하는 로딩 안정성, 입력 반응성, 레이아웃 흔들림을 확인하기 위해 Web Vitals 측정 컴포넌트를 추가했습니다.

이번 단계에서는 성능 점수를 확정해서 적기보다, 개발 환경에서 Core Web Vitals를 확인할 수 있는 기반을 만드는 데 초점을 두었습니다.

중점적으로 확인할 지표는 다음 3가지입니다.

- LCP: 상품 이미지나 상세 대표 콘텐츠가 빠르게 표시되는지 확인
- INP: 찜, 입찰, 탭 전환 같은 사용자 입력 반응 확인
- CLS: 상품 카드 이미지, 상세 대표 이미지, countdown 영역의 레이아웃 흔들림 확인

---

## 측정 방법

개발 환경에서 `components/performance/WebVitals.tsx`가 Core Web Vitals 값을 console로 출력합니다.

```bash
npm run dev
```

브라우저 DevTools console에서 `[CoreWebVitals]` 로그를 확인합니다.

확인 대상 페이지는 다음과 같습니다.

- `/`
- `/products`
- `/auctions`
- `/products/[id]`
- `/mypage`

---

## 지표별 확인 방법

### LCP

페이지에 처음 진입했을 때 대표 콘텐츠가 표시되는 시점을 확인합니다.

확인 대상:

- 홈 화면 hero 영역
- 상품 목록의 상품 카드 이미지
- 상품 상세의 대표 이미지
- 경매 상세의 대표 이미지와 가격 정보 영역

### INP

사용자 입력 후 화면이 얼마나 빠르게 반응하는지 확인합니다.

확인 대상:

- 찜 버튼 클릭
- 입찰 금액 입력
- 입찰 버튼 클릭
- 마이페이지 탭 전환
- 상품 수정 화면의 이미지 추가 / 삭제 예정 처리

### CLS

이미지나 동적 텍스트 때문에 화면이 흔들리는지 확인합니다.

확인 대상:

- 상품 카드 이미지 로딩 전후
- 상품 상세 대표 이미지 로딩 전후
- 경매 countdown 텍스트 변경
- skeleton 또는 빈 상태 UI 표시 영역

---

## Lighthouse 확인 방법

실제 빌드 결과에 가깝게 확인하려면 production build 후 Lighthouse를 실행합니다.

```bash
npm run build
npm start
```

그다음 Chrome DevTools에서 Lighthouse를 실행합니다.

확인 대상:

- `/`
- `/products`
- `/auctions`
- `/products/[id]`
- `/mypage`

확인할 항목:

- Performance score
- LCP element
- CLS 원인
- render blocking resource
- image size warning
- unused JavaScript

현재 문서에는 실제 점수를 적지 않습니다.  
측정 후 결과가 생기면 페이지별 LCP / INP / CLS 값을 따로 기록합니다.

---

## 적용한 안정화 작업

### 상품 카드 이미지

상품 카드 이미지 영역을 `aspect-[4/3]` 기반으로 고정했습니다.

목적:

- 이미지 로딩 전후 카드 높이 변동 방지
- 상품 목록 grid 흔들림 감소
- CLS 발생 가능성 감소

### 상품 상세 대표 이미지

상품 상세 대표 이미지 영역도 `aspect-[4/3]`를 적용했습니다.

목적:

- 대표 이미지 로딩 전 공간 확보
- 상세 페이지 첫 화면 레이아웃 안정화
- LCP 후보 영역의 크기 안정화

### Countdown 영역

경매 카드의 남은 시간 영역은 최소 높이와 너비를 확보했습니다.

목적:

- 남은 시간 텍스트 길이 변화로 인한 UI 흔들림 방지
- 경매 상태 변경 시 카드 높이 유지
- 목록 화면에서 카드 간 높이 차이 감소

---

## 추후 개선 후보

- 실제 배포 환경에서 Lighthouse 측정
- 상품 목록 이미지에 `next/image` 도입 검토
- 상세 대표 이미지 preload 검토
- 상품 카드 skeleton 높이 추가 고정
- 홈 화면에 실시간 인기 상품을 넣을 경우 ISR 또는 dynamic rendering 기준 재검토