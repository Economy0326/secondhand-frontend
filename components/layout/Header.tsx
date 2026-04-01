import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="container-default flex h-20 items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-xl font-semibold tracking-wide text-white">
          SecondHand <span className="gold-text">Auction</span>
        </Link>

        {/* 가운데 메뉴 - 모바일에서는 일단 숨김 */}
        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <Link href="/products" className="transition hover:text-white">
            상품
          </Link>
          <Link href="/auctions" className="transition hover:text-white">
            경매
          </Link>
          <Link href="/sell" className="transition hover:text-white">
            판매하기
          </Link>
          <Link href="/mypage" className="transition hover:text-white">
            마이페이지
          </Link>
        </nav>

        {/* 우측 로그인/회원가입 */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
          >
            로그인
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}