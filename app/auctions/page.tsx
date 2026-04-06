import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import { getAuctionsByStatus } from "@/services/auction.service";

export default async function AuctionsPage() {
  const auctions = await getAuctionsByStatus("RUNNING");

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <SectionTitle
          eyebrow="Auction Only"
          title="경매 상품"
          description="현재 진행 중인 경매 상품을 모아볼 수 있습니다."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {auctions.map((auction) => (
          <ProductListCard
            key={auction.id}
            id={auction.productId}
            title={auction.productTitle}
            description={`${auction.sellerNickname} 판매 상품`}
            isAuction
            currentBidPrice={auction.currentPrice}
            likes={0}
            status={auction.status}
          />
        ))}
      </div>
    </section>
  );
}