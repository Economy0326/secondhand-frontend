# Performance Notes

## 목표

이 프로젝트의 성능 개선 목표는 상품 탐색과 경매 상세 화면에서 사용자가 체감하는 로딩 안정성, 클릭 반응성, 레이아웃 흔들림을 줄이는 것이다.

주요 확인 지표는 다음과 같다.

- LCP: 대표 콘텐츠가 빠르게 표시되는지 확인
- INP: 찜, 입찰, 탭 전환 같은 사용자 입력 반응 확인
- CLS: 상품 카드 이미지, 상세 대표 이미지, countdown 영역의 레이아웃 흔들림 확인

## 측정 방법

### 1. 개발 환경 Web Vitals 로그

`components/performance/WebVitals.tsx`에서 `useReportWebVitals`를 사용해 개발 환경에서 metric을 console로 출력한다.

확인 대상:

- TTFB
- FCP
- LCP
- FID
- INP
- CLS

확인 방법:

```bash
npm run dev
```

브라우저 DevTools console에서 `[WebVitals]` 로그를 확인한다.

### 2. Lighthouse 측정

Chrome DevTools Lighthouse에서 다음 페이지를 확인한다.

- `/`
- `/products`
- `/auctions`
- `/products/[id]`
- `/mypage`

측정 시 확인할 항목:

- Performance score
- LCP element
- CLS 원인
- render blocking resource
- unused JavaScript
- image size warning

## 적용한 안정화 작업

### 상품 카드 이미지

상품 카드 이미지 영역을 고정 높이 중심에서 `aspect-[4/3]` 기반으로 변경했다.

목적:

- 이미지 로딩 전후 카드 높이 변동 방지
- 상품 목록 grid의 흔들림 감소
- CLS 감소

### 상품 상세 대표 이미지

상품 상세 대표 이미지도 wrapper에 `aspect-[4/3]`를 적용하고, 내부 이미지는 `h-full w-full object-cover`로 채웠다.

목적:

- 대표 이미지 로딩 전 공간 확보
- 상세 페이지 첫 화면 레이아웃 안정화
- LCP 후보 영역의 크기 안정화

### Countdown 영역

경매 카드의 남은 시간 영역은 최소 높이와 필요 시 최소 너비를 확보한다.

목적:

- 남은 시간 텍스트 길이 변화로 인한 UI 흔들림 방지
- 경매 상태 변경 시 카드 높이 유지

## 추후 개선 후보

- 상품 목록 이미지에 `next/image` 도입
- 주요 hero 이미지 preload 검토
- 실제 배포 환경에서 RUM 수집
- 인기 상품 섹션이 동적으로 바뀔 경우 ISR 또는 dynamic rendering 기준 재검토