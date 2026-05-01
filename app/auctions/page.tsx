import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import { getAuctions, getAuctionsByStatus } from "@/services/auction.service";
import { AuctionStatus } from "@/types/auction";

type Props = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

type AuctionStatusFilter = AuctionStatus | "ALL";

function isAuctionStatus(value?: string): value is AuctionStatus {
  return (
    value === "READY" ||
    value === "RUNNING" ||
    value === "FINISHED" ||
    value === "FAILED" ||
    value === "CANCELLED"
  );
}

function getFilterClass(isActive: boolean) {
  return isActive
    ? "rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]"
    : "rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5";
}

export default async function AuctionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params?.status;

  const activeStatus: AuctionStatusFilter = isAuctionStatus(status)
    ? status
    : "ALL";

  const auctions = isAuctionStatus(status)
    ? await getAuctionsByStatus(status)
    : await getAuctions();

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Auction House"
          title="경매장"
          description="시작 예정, 진행 중, 종료된 경매를 상태별로 확인해보세요."
        />

        <div className="flex flex-wrap gap-3">
          <Link href="/auctions" className={getFilterClass(activeStatus === "ALL")}>
            전체
          </Link>

          <Link
            href="/auctions?status=READY"
            className={getFilterClass(activeStatus === "READY")}
          >
            시작 전
          </Link>

          <Link
            href="/auctions?status=RUNNING"
            className={getFilterClass(activeStatus === "RUNNING")}
          >
            진행 중
          </Link>

          <Link
            href="/auctions?status=FINISHED"
            className={getFilterClass(activeStatus === "FINISHED")}
          >
            종료
          </Link>

          <Link
            href="/auctions?status=FAILED"
            className={getFilterClass(activeStatus === "FAILED")}
          >
            유찰
          </Link>

          <Link
            href="/auctions?status=CANCELLED"
            className={getFilterClass(activeStatus === "CANCELLED")}
          >
            취소
          </Link>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">해당 상태의 경매가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {auctions.map((auction) => (
            <ProductListCard
              key={auction.id}
              id={auction.productId}
              title={auction.productTitle}
              description={`${auction.sellerNickname} 판매 상품`}
              isAuction
              currentPrice={auction.currentPrice}
              buyNowPrice={auction.buyNowPrice}
              startPrice={auction.startPrice}
              likes={0}
              status={auction.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}