import SectionTitle from "@/components/common/SectionTitle";

const guideItems = [
  {
    title: "상품 둘러보기",
    description: "전체 상품과 경매장에서 원하는 상품을 검색하고 비교해보세요.",
  },
  {
    title: "입찰 참여",
    description: "진행 중인 경매에서 현재 입찰가보다 높은 금액으로 입찰할 수 있습니다.",
  },
  {
    title: "경매 종료 확인",
    description: "경매가 종료되면 최종 가격과 낙찰 결과를 확인할 수 있습니다.",
  },
];

export default function AuctionGuideSection() {
  return (
    <section className="container-default py-10">
      <div className="mb-8">
        <SectionTitle
          eyebrow="How It Works"
          title="경매 이용 방법"
          description="처음 이용하는 사용자도 쉽게 경매에 참여할 수 있습니다."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {guideItems.map((item, index) => (
          <div key={item.title} className="luxury-panel p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-lg font-semibold text-[var(--accent)]">
              {index + 1}
            </div>

            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}