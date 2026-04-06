import { apiFetch } from "@/lib/api";
import { Auction, AuctionStatus } from "@/types/auction";

export function getAuctionByProductId(productId: number) {
  return apiFetch<Auction>(`/api/auctions/product/${productId}`);
}

export function getAuctionsByStatus(status: AuctionStatus) {
  return apiFetch<Auction[]>(`/api/auctions/status/${status}`);
}