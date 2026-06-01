import { apiFetch } from "@/lib/api";
import { buildSearchQuery } from "@/lib/product-query";
import { mockAuctions } from "@/mocks/auctions.mock";
import type { Auction, AuctionStatus } from "@/types/auction";

const USE_MOCK_AUCTIONS =
  process.env.NEXT_PUBLIC_USE_MOCK_AUCTIONS === "true";

export function getAuctions(): Promise<Auction[]> {
  if (USE_MOCK_AUCTIONS) {
    return Promise.resolve(mockAuctions);
  }

  return apiFetch<Auction[]>("/api/auctions");
}

export function getAuctionByProductId(productId: number): Promise<Auction> {
  if (USE_MOCK_AUCTIONS) {
    const auction = mockAuctions.find((item) => item.productId === productId);

    if (!auction) {
      return Promise.reject(new Error("mock auction not found"));
    }

    return Promise.resolve(auction);
  }

  return apiFetch<Auction>(`/api/auctions/product/${productId}`);
}

export function getAuctionsByStatus(
  status: AuctionStatus
): Promise<Auction[]> {
  if (USE_MOCK_AUCTIONS) {
    return Promise.resolve(
      mockAuctions.filter((auction) => auction.status === status)
    );
  }

  // 리스트인 이유: 여러 개의 경매 상품이 있을 수 있기 때문
  return apiFetch<Auction[]>(`/api/auctions/status/${status}`);
}

export function searchAuctions(params: {
  keyword?: string;
  status?: AuctionStatus;
  category?: string;
}): Promise<Auction[]> {
  if (USE_MOCK_AUCTIONS) {
    const keyword = params.keyword?.trim().toLowerCase();

    return Promise.resolve(
      mockAuctions.filter((auction) => {
        const matchesKeyword = keyword
          ? auction.productTitle.toLowerCase().includes(keyword) ||
            auction.sellerNickname.toLowerCase().includes(keyword)
          : true;

        const matchesStatus = params.status
          ? auction.status === params.status
          : true;

        /**
         * 현재 Auction 타입에는 category 필드가 없습니다.
         * 그래서 mock 경매 검색에서는 category 필터를 적용하지 않습니다.
         * 백엔드 응답에 category가 추가되면 여기서 함께 필터링하면 됩니다.
         */
        return matchesKeyword && matchesStatus;
      })
    );
  }

  const queryString = buildSearchQuery(params);

  return apiFetch<Auction[]>(
    `/api/auctions/search${queryString ? `?${queryString}` : ""}`
  );
}

export function cancelAuction(auctionId: number): Promise<void> {
  if (USE_MOCK_AUCTIONS) {
    return Promise.resolve();
  }

  return apiFetch<void>(`/api/auctions/${auctionId}/cancel`, {
    method: "PATCH",
    auth: true,
  });
}