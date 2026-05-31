import type { AuctionStatus } from "@/types/auction";

type ValidateBidAmountParams = {
  bidAmount: number;
  currentPrice: number;
  buyNowPrice?: number | null;
};

export function getBidAmountError({
  bidAmount,
  currentPrice,
  buyNowPrice,
}: ValidateBidAmountParams) {
  if (!bidAmount || bidAmount <= 0) {
    return "입찰 금액을 올바르게 입력해주세요.";
  }

  if (bidAmount <= currentPrice) {
    return `현재 입찰가 ${currentPrice.toLocaleString("ko-KR")}원보다 높은 금액을 입력해주세요.`;
  }

  if (buyNowPrice !== undefined && buyNowPrice !== null) {
    if (bidAmount > buyNowPrice) {
      return `입찰 금액은 즉시 구매가 ${buyNowPrice.toLocaleString("ko-KR")}원을 초과할 수 없습니다.`;
    }
  }

  return null;
}

type CanBidParams = {
  status?: AuctionStatus | null;
  bidAmount: number;
  currentPrice: number;
  buyNowPrice?: number | null;
  isLoggedIn?: boolean;
  isSeller?: boolean;
};

export function canBid({
  status = "RUNNING",
  bidAmount,
  currentPrice,
  buyNowPrice,
  isLoggedIn = true,
  isSeller = false,
}: CanBidParams) {
  if (!isLoggedIn) return false;
  if (isSeller) return false;
  if (status !== "RUNNING") return false;

  return getBidAmountError({
    bidAmount,
    currentPrice,
    buyNowPrice,
  }) === null;
}