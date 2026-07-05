"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);

  // useEffect는 Header가 마운트될 때 auth 상태를 localStorage에서 한 번 동기화하고,
  // 이후 auth-change 이벤트가 발생할 때마다 다시 동기화함.
  useEffect(() => {
    function syncUser() {
      // getStoredUser 함수 호출은 useAuthStore의 hydrate 내부에서 처리됨.
      // 로컬 스토리지에서 사용자 정보를 가져와 user 상태에 저장하는 역할.
      hydrate();
    }

    syncUser();

    // 로그인/로그아웃 시 같은 탭에서 Header 상태를 바로 반영하기 위한 이벤트
    // 헤더 상태 반영이 필요한 이유:
    // 로그인/로그아웃 후 페이지를 새로고침하지 않아도
    // 헤더의 로그인 상태가 즉시 업데이트되어야 사용자 경험이 향상됨
    window.addEventListener("auth-change", syncUser);

    // storage 이벤트는 다른 탭에서 localStorage가 변경되었을 때 동기화하기 위함
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [hydrate]);

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <header className="border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
      <div className="container-default flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold text-white">
          SecondHand Auction
        </Link>

        <nav className="flex items-center gap-5 text-sm text-white/70">
          <Link href="/products" className="transition hover:text-white">
            전체 상품
          </Link>
          <Link href="/auctions" className="transition hover:text-white">
            경매장
          </Link>
          <Link href="/sell" className="transition hover:text-white">
            판매하기
          </Link>
          <Link href="/mypage" className="transition hover:text-white">
            마이페이지
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-white/70">{user.nickname}님</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-4 py-2 text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-black transition hover:opacity-90"
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