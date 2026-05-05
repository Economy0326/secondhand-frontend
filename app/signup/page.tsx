"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/services/auth.service";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      setIsPending(true);
      setErrorMessage("");

      if (!email.trim()) {
        throw new Error("이메일을 입력해주세요.");
      }

      if (!password.trim()) {
        throw new Error("비밀번호를 입력해주세요.");
      }

      if (!name.trim()) {
        throw new Error("이름을 입력해주세요.");
      }

      if (!nickname.trim()) {
        throw new Error("닉네임을 입력해주세요.");
      }

      if (!phoneNumber.trim()) {
        throw new Error("전화번호를 입력해주세요.");
      }

      if (!address.trim()) {
        throw new Error("주소를 입력해주세요.");
      }

      await signup({
        email,
        password,
        name,
        nickname,
        phoneNumber,
        address,
      });

      router.push("/login");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원가입에 실패했습니다."
      );
    } finally {
      // setIsPending(false): 회원가입 요청이 완료되었거나 실패했음을 나타내기 위해 진행 중 상태를 해제하여 버튼을 다시 활성화하고, 사용자에게 회원가입이 완료되었거나 실패했음을 시각적으로 표시
      setIsPending(false);
    }
  }

  return (
    <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="luxury-panel w-full max-w-lg p-8 md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Join Us
        </p>
        <h1 className="text-3xl font-semibold text-white">회원가입</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          새로운 계정을 만들고 프리미엄 중고 거래와 경매를 시작해보세요.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-white/70">이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

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

          <div>
            <label className="mb-2 block text-sm text-white/70">전화번호</label>
            <input
              type="text"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">주소</label>
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </section>
  );
}