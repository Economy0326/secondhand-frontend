import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import { getAuctionsByStatus } from "@/services/auction.service";

export default async function ClosingSoonAuctionSection() {
  const auctions = await getAuctionsByStatus("RUNNING");

  const closingSoonAuctions = auctions
    .sort(
      (a, b) =>
        new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
    )
    // slice : 마감 임박 경매 중 상위 3개만 표시
    .slice(0, 3);

  return (
    <section className="container-default py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Closing Soon"
          title="마감 임박 경매"
          description="곧 종료되는 경매 상품을 확인하고 마지막 입찰에 참여해보세요."
        />

        <Link
          href="/auctions?status=RUNNING"
          className="w-fit rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
        >
          진행 중인 경매 더보기
        </Link>
      </div>

      {closingSoonAuctions.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">현재 진행 중인 경매가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {closingSoonAuctions.map((auction) => (
            <ProductListCard
              key={auction.id}
              id={auction.productId}
              title={auction.productTitle}
              description={`${auction.sellerNickname} 판매 상품`}
              isAuction
              currentPrice={auction.currentPrice}
              startPrice={auction.startPrice}
              buyNowPrice={auction.buyNowPrice}
              likes={auction.likeCount}
              status={auction.status}
              auctionStartTime={auction.startTime}
              auctionEndTime={auction.endTime}
            />
          ))}
        </div>
      )}
    </section>
  );
}