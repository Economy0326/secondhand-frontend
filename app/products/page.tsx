import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";

// 나중에는 API 데이터로 교체
const products = [
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
  {
    id: 3,
    title: "아이패드 에어 5세대",
    description: "일반 판매 상품. 생활기스 거의 없고 배터리 양호.",
    isAuction: false,
    price: "650,000원",
    likes: 22,
  },
  {
    id: 4,
    title: "폴라로이드 카메라",
    description: "빈티지 감성 카메라. 소장용으로도 좋습니다.",
    isAuction: true,
    currentBidPrice: "72,000원",
    buyNowPrice: "95,000원",
    likes: 9,
    status: "FINISHED" as const,
  },
  {
    id: 5,
    title: "맥북 에어 M1",
    description: "실사용 적고 외관 깨끗한 편입니다.",
    isAuction: false,
    price: "890,000원",
    likes: 41,
  },
  {
    id: 6,
    title: "Leica 필름 카메라",
    description: "카메라 수집가에게 인기 있는 모델입니다.",
    isAuction: true,
    currentBidPrice: "1,280,000원",
    buyNowPrice: "1,500,000원",
    likes: 14,
    status: "RUNNING" as const,
  },
];

export default function ProductsPage() {
  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Marketplace"
          title="전체 상품"
          description="일반 거래 상품과 경매 상품을 한눈에 확인해보세요."
        />

        {/* 정렬/필터 자리 */}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
            전체
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            일반 거래
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            경매
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            최신순
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductListCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}