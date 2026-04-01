import StatusBadge from "@/components/common/StatusBadge";

export default function ProductDetailPage() {
  const product = {
    id: 1,
    title: "Rolex Oyster Perpetual",
    description:
      "희소성 높은 프리미엄 시계입니다. 보증서 포함, 상태 우수. 일반 거래와 경매의 장점을 함께 살린 형태로 등록된 상품입니다.",
    isAuction: true,
    status: "RUNNING" as const,
    currentBidPrice: "4,850,000원",
    buyNowPrice: "5,600,000원",
    seller: "luxury_seller",
    likes: 31,
    bidCount: 12,
  };

  return (
    <section className="container-default py-12 md:py-16">
      {/* grid: 그 안에 들어있는 직계 자식 요소 개수만큼 칸에 배치 */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 왼쪽: 이미지 영역 */}
        <div className="space-y-4">
          <div className="luxury-panel overflow-hidden p-4">
            <div className="aspect-[4/3] rounded-[24px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="luxury-panel aspect-square rounded-[20px] p-2"
              >
                <div className="h-full w-full rounded-[14px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 정보 영역 */}
        <div className="space-y-6">
          <div className="luxury-panel p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <StatusBadge status={product.status} />
              <span className="text-sm text-white/50">♥ {product.likes}</span>
            </div>

            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/65">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs text-white/45">현재 입찰가</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {product.currentBidPrice}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs text-white/45">즉시 구매가</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--accent)]">
                  {product.buyNowPrice}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/45">판매자</p>
                <p className="mt-2 text-white">{product.seller}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/45">입찰 수</p>
                <p className="mt-2 text-white">{product.bidCount}회</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-[#0f1420] p-4">
                <label className="mb-2 block text-sm text-white/70">
                  입찰 금액 입력
                </label>
                <input
                  type="number"
                  placeholder="현재 입찰가보다 높은 금액을 입력하세요"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <button className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90">
                  입찰하기
                </button>
                <button className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white/85 transition hover:bg-white/5">
                  찜하기
                </button>
              </div>
            </div>
          </div>

          {/* QnA 영역 */}
          <div className="luxury-panel p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">QnA</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/80">
                  배터리 상태나 사용감은 어떤가요?
                </p>
                <p className="mt-3 text-sm text-white/45">
                  작성자: user123 · 2시간 전
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
                <p className="text-sm text-white/80">
                  생활기스는 거의 없고, 전체적으로 상태 좋습니다.
                </p>
                <p className="mt-3 text-sm text-[var(--accent)]">
                  판매자 답변 · 1시간 전
                </p>
              </div>

              <textarea
                placeholder="질문을 입력하세요"
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
              />

              <button className="rounded-full border border-white/10 px-6 py-3 text-white/85 transition hover:bg-white/5">
                질문 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}