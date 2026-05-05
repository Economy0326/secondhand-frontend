import { apiFetch } from "@/lib/api";
import { Bid, CreateBidRequest } from "@/types/bid";

export function createBid(auctionId: number, payload: CreateBidRequest) {
  return apiFetch<Bid>(`/api/auctions/${auctionId}/bids`, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function getBidsByAuctionId(auctionId: number) {
  return apiFetch<Bid[]>(`/api/auctions/${auctionId}/bids`);
}

export function getHighestBid(auctionId: number) {
  return apiFetch<Bid>(`/api/auctions/${auctionId}/bids/highest`);
}

export function getMyBids() {
  return apiFetch<Bid[]>("/api/auctions/bids/me", {
    auth: true,
  });
}

export function getBidCount(auctionId: number) {
  return apiFetch<number>(`/api/auctions/${auctionId}/bids/count`);
}