"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { saveAuth } from "@/lib/storage";

export default function LoginPage() {
  // useRouter는 페이지 간 이동을 제어할 수 있는 Next.js의 훅
  const router = useRouter();

  // useState는 상태가 변했을 때 컴포넌트를 다시 렌더링하여 UI를 업데이트하는 React의 훅
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // isPending: 로그인 요청이 진행 중일 때 버튼을 비활성화하여 사용자가 여러 번 클릭하는 것을 방지
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      // ispending이 true로 설정되어 로그인 요청이 진행 중임을 나타냄. 이 상태에서는 로그인 버튼이 비활성화되어 사용자가 여러 번 클릭하는 것을 방지
      setIsPending(true);
      setErrorMessage("");

      const result = await login({ email, password });
      saveAuth(result);
      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "로그인에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="luxury-panel w-full max-w-md p-8 md:p-10">
        {/* tracking-[0.2em]: 글자 간격 조절 */}
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Welcome Back
        </p>
        <h1 className="text-3xl font-semibold text-white">로그인</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          계정에 로그인하고 경매 입찰과 찜 기능을 이용해보세요.
        </p>

        {/* onSubmit = handleSubmit 뜻: 폼이 제출될 때 handleSubmit 함수를 호출 */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-white/70">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            // disabled 속성은 isPending이 true일 때 버튼을 비활성화하여 사용자가 여러 번 클릭하는 것을 방지
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
}