export const PRODUCT_CATEGORIES = [
  "전자기기",
  "패션",
  "가구",
  "도서",
  "생활용품",
  "여행 용품",
  "자동차 용품",
  "스포츠",
  "취미",
  "기타",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];