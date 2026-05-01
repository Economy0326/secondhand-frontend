"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyPage() {
  // useRouter: Next.js에서 페이지 이동을 제어할 수 있는 훅
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      // router.replace: 현재 페이지를 로그인 페이지로 대체하여 이동. 
      // replace를 사용하면 사용자가 뒤로 가기 버튼을 눌렀을 때 로그인 페이지로 돌아가지 않음
      router.replace("/login");
    }
  }, [router]);

  const menu = ["내 등록 상품", "내 입찰 목록", "내 찜 목록", "내 질문 목록"];

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        {/* tracking-[0.2em]: 글자 간격 조절 */}
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          My Account
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          마이페이지
        </h1>
      </div>

      {/* grid-cols-[280px_1fr]: 첫 번째 열은 280px 고정, 두 번째 열은 남은 공간을 차지하도록 설정 */}
      {/* fr: 남은 공간을 차지함 */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="luxury-panel h-fit p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/45">회원</p>
            <p className="mt-2 text-xl font-semibold text-white">user</p>
            <p className="mt-2 text-sm text-white/55">email@example.com</p>
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

        <div className="luxury-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">내 등록 상품</h2>
        </div>
      </div>
    </section>
  );
}