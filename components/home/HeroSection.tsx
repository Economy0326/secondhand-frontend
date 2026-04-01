import Link from "next/link";
import StatusBadge from "../common/StatusBadge";

export default function HeroSection() {
  return (
    <section className="container-default pt-16 pb-14 md:pt-24 md:pb-20">
      <div className="luxury-panel overflow-hidden">
        {/* grid:왼쪽 소개 문구 / 오른쪽 대표 경매 카드 */}
        <div className="grid gap-10 px-8 py-10 md:grid-cols-2 md:px-14 md:py-16">
          
          {/* 왼쪽 소개 문구 */}
          {/* flex: 기본 방향은 가로, flex-col: 세로 배치 */}
          <div className="flex flex-col justify-center">
            {/* tracking-[0.3em]: 글자 사이 간격 */}
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
              Premium Secondhand Auction
            </p>

            {/* leading-tight: 줄 간격을 타이트하게 */}
            <h1 className="mb-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
              가치 있는 중고,
              <br />
              더 품격 있게 거래하다
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              일반 거래와 경매를 하나의 플랫폼에서.
              <br />
              희소성 있는 제품을 발견하고, 실시간 입찰로 더 특별한 거래를
              경험해보세요.
            </p>

            {/* flex-wrap: 공간이 부족하면 다음 줄로 넘어가도록 */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auctions"
                className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                진행 중인 경매 보기
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white/90 transition hover:bg-white/5"
              >
                전체 상품 보기
              </Link>
            </div>
          </div>

          {/* 오른쪽 대표 경매 카드 */}
          <div className="flex items-center">
            <div className="w-full rounded-[28px] border border-white/10 bg-gradient-to-br from-[#242b3d] to-[#121621] p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <StatusBadge status="RUNNING" />
                <span className="text-sm text-white/50">남은 시간 02:14:39</span>
              </div>

              {/* 실제 이미지 대신 임시 영역 */}
              {/* aspect-[4/3]: 가로 세로 비율 4:3 유지 */}
              <div className="aspect-[4/3] rounded-[22px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-white">
                  Rolex Oyster Perpetual
                </h3>
                <p className="mt-2 text-white/60">
                  희소성 높은 프리미엄 시계 경매
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/50">현재 입찰가</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      4,850,000원
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/50">즉시 구매가</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--accent)]">
                      5,600,000원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 오른쪽 카드 끝 */}
          
        </div>
      </div>
    </section>
  );
}