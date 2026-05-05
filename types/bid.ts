import { AuctionStatus } from "@/types/auction";

export interface CreateBidRequest {
  bidPrice: number;
}

export interface Bid {
  id: number;
  auctionId: number;
  productId: number;
  productTitle: string;
  auctionStatus: AuctionStatus;
  userId: number;
  userNickname: string;
  bidPrice: number;
  bidTime: string;
}