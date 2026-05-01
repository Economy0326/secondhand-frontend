export type AuctionStatus =
  | "READY"
  | "RUNNING"
  | "FINISHED"
  | "FAILED"
  | "CANCELLED";

export interface Auction {
  id: number;
  productId: number;
  productTitle: string;
  sellerNickname: string;

  startPrice: number;
  currentPrice: number;
  buyNowPrice: number | null;

  startTime: string;
  endTime: string;
  status: AuctionStatus;
  bidCount: number;

  winnerId: number | null;
  winnerNickname: string | null;

  createdAt: string;
}