import LuxuryProductCard from "@/components/home/LuxuryProductCard";
import SectionTitle from "../common/SectionTitle";

// 우선은 더미 데이터로 화면부터 만듭니다.
const dummyProducts = [
  {
    id: 1,
    title: "Sony WH-1000XM5",
    status: "RUNNING" as const,
    currentPrice: "285,000원",
    buyNowPrice: "320,000원",
    likes: 18,
  },
  {
    id: 2,
    title: "아이패드 에어 5세대",
    status: "READY" as const,
    currentPrice: "610,000원",
    buyNowPrice: "690,000원",
    likes: 27,
  },
  {
    id: 3,
    title: "폴라로이드 카메라",
    status: "FINISHED" as const,
    currentPrice: "72,000원",
    buyNowPrice: "95,000원",
    likes: 9,
  },
];

export default function FeaturedAuctionSection() {
  return (
    <section className="container-default py-10">
      <div className="mb-8">
        <SectionTitle
          eyebrow="Featured Auctions"
          title="주목할 만한 경매"
          description="지금 가장 눈길을 끄는 프리미엄 경매 상품을 확인해보세요."
        />
      </div>

      {/* 더미상품의 각 상품 객체를 LuxuryProductCard에 넘기고, LuxuryProductCard는 그 props를 받아서 카드 UI에 값들을 채워 넣는 구조 */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dummyProducts.map((product) => (
          <LuxuryProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}