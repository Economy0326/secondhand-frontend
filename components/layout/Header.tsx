"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearAuth, getStoredUser } from "@/lib/storage";

type StoredUser = {
  nickname: string;
} | null;

export default function Header() {
  const [user, setUser] = useState<StoredUser>(null);

  // useEffect 빈 배열일 경우 컴포넌트가 마운트될 때 한 번만 실행됨. getStoredUser 함수를 호출하여 로컬 스토리지에서 사용자 정보를 가져와 user 상태에 저장
  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearAuth();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="container-default flex h-20 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-wide text-white">
          SecondHand <span className="gold-text">Auction</span>
        </Link>

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

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-white/80">{user.nickname}님</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}