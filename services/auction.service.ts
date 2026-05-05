import { apiFetch } from "@/lib/api";
import { Auction, AuctionStatus } from "@/types/auction";

export function getAuctions() {
  return apiFetch<Auction[]>("/api/auctions");
}

export function getAuctionByProductId(productId: number) {
  return apiFetch<Auction>(`/api/auctions/product/${productId}`);
}

export function getAuctionsByStatus(status: AuctionStatus) {
  // 리스트인 이유: 여러 개의 경매 상품이 있을 수 있기 때문
  return apiFetch<Auction[]>(`/api/auctions/status/${status}`);
}

export function searchAuctions(params: {
  keyword?: string;
  status?: AuctionStatus;
  category?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.append("keyword", params.keyword);
  }

  if (params.status) {
    searchParams.append("status", params.status);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  const queryString = searchParams.toString();

  return apiFetch<Auction[]>(
    `/api/auctions/search${queryString ? `?${queryString}` : ""}`
  );
}