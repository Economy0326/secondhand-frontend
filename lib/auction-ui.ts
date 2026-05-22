import { AuctionStatus } from "@/types/auction";

export function formatRemainingTime(targetTime?: string | null) {
  if (!targetTime) return null;

  const diff = new Date(targetTime).getTime() - Date.now();

  if (diff <= 0) {
    return "종료됨";
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }

  return `${minutes}분 남음`;
}

export function getAuctionPriceLabel(status?: AuctionStatus | null) {
  switch (status) {
    case "FINISHED":
      return "최종 낙찰가";
    case "FAILED":
      return "최종 가격";
    case "CANCELLED":
      return "취소 전 현재가";
    default:
      return "현재 입찰가";
  }
}

export function getAuctionDetailMessage(status: AuctionStatus) {
  switch (status) {
    case "READY":
      return "경매 시작 전입니다. 시작 시간이 되면 입찰할 수 있습니다.";
    case "RUNNING":
      return "경매가 진행 중입니다. 현재 입찰가보다 높은 금액으로 입찰할 수 있습니다.";
    case "FINISHED":
      return "경매가 종료되었습니다. 최종 낙찰가를 확인할 수 있습니다.";
    case "FAILED":
      return "입찰 없이 종료되어 유찰된 경매입니다.";
    case "CANCELLED":
      return "판매자에 의해 취소된 경매입니다.";
  }
}

export function getAuctionTimeText(params: {
  status?: AuctionStatus | null;
  startTime?: string | null;
  endTime?: string | null;
}) {
  const { status, startTime, endTime } = params;

  if (!status) return null;

  switch (status) {
    case "READY":
      return startTime ? `시작 예정 ${formatRemainingTime(startTime)}` : "경매 시작 전";
    case "RUNNING":
      return endTime ? `남은 시간 ${formatRemainingTime(endTime)}` : "경매 진행 중";
    case "FINISHED":
      return "경매 종료";
    case "FAILED":
      return "유찰";
    case "CANCELLED":
      return "경매 취소";
  }
}