// 숫자를 받아서 한국 원화 형식으로 변환하는 함수
export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

// 경매 상태에 따라 적절한 라벨을 반환하는 함수
export function getAuctionStatusLabel(status: "READY" | "RUNNING" | "FINISHED") {
  switch (status) {
    case "READY":
      return "경매 시작 전";
    case "RUNNING":
      return "경매 진행중";
    case "FINISHED":
      return "경매 종료";
  }
}