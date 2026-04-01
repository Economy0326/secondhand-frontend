export default function SellPage() {
  return (
    // margin: 바깥쪽 여백, padding: 안쪽 여백
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Sell Product
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          상품 등록
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          일반 판매 또는 경매 상품으로 등록할 수 있습니다.
        </p>
      </div>

      <div className="luxury-panel p-6 md:p-8">
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">상품명</label>
              <input
                type="text"
                placeholder="상품명을 입력하세요"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                판매 방식
              </label>
              <select className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none">
                <option>일반 거래</option>
                <option>경매</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">상품 설명</label>
            <textarea
              placeholder="상품 설명을 입력하세요"
              className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">판매가</label>
              <input
                type="number"
                placeholder="일반 상품 가격"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                시작 입찰가
              </label>
              <input
                type="number"
                placeholder="경매 시작가"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                즉시 구매가
              </label>
              <input
                type="number"
                placeholder="선택 입력"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                이미지 업로드
              </label>
              <input
                type="file"
                multiple
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                경매 시작 시간
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                경매 종료 시간
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          <button className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90">
            상품 등록하기
          </button>
        </form>
      </div>
    </section>
  );
}