export default function MyPage() {
  const menu = [
    "내 등록 상품",
    "내 입찰 목록",
    "내 찜 목록",
    "내 질문 목록",
  ];

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          My Account
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          마이페이지
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* 왼쪽 메뉴 */}
        <aside className="luxury-panel h-fit p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/45">회원</p>
            <p className="mt-2 text-xl font-semibold text-white">
              luxury_user
            </p>
            <p className="mt-2 text-sm text-white/55">
              premium@example.com
            </p>
          </div>

          <nav className="mt-4 space-y-2">
            {menu.map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-[var(--accent)] text-black"
                    : "border border-white/10 text-white/75 hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* 오른쪽 내용 */}
        <div className="luxury-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">내 등록 상품</h2>

          <div className="mt-6 space-y-4">
            {[
              {
                title: "Rolex Oyster Perpetual",
                type: "경매",
                price: "현재 입찰가 4,850,000원",
              },
              {
                title: "맥북 에어 M1",
                type: "일반 거래",
                price: "판매가 890,000원",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                {/* justiy-between: 양쪽 끝으로 벌려서 배치 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-white/55">{item.type}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm text-white/75">{item.price}</p>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                      수정
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}