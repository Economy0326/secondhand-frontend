// 숫자를 받아서 한국 원화 형식으로 변환하는 함수
export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}
