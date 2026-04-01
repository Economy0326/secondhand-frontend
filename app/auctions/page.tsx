import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";

const auctions = [
  {
    id: 1,
    title: "Rolex Oyster Perpetual",
    description: "희소성 높은 프리미엄 시계 경매 상품입니다.",
    isAuction: true,
    currentBidPrice: "4,850,000원",
    buyNowPrice: "5,600,000원",
    likes: 31,
    status: "RUNNING" as const,
  },
  {
    id: 2,
    title: "Sony WH-1000XM5",
    description: "상태 좋은 헤드폰. 박스 포함, 실사용 적음.",
    isAuction: true,
    currentBidPrice: "285,000원",
    buyNowPrice: "320,000원",
    likes: 18,
    status: "READY" as const,
  },
];

export default function AuctionsPage() {
  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <SectionTitle
          eyebrow="Auction Only"
          title="경매 상품"
          description="현재 진행 중이거나 예정된 경매 상품을 모아볼 수 있습니다."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {auctions.map((product) => (
          <ProductListCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}