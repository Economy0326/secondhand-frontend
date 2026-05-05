"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductStatus } from "@/types/product";

type Props = {
  defaultKeyword?: string;
  status?: ProductStatus;
  category?: string;
};

export default function ProductSearchForm({
  defaultKeyword = "",
  status,
  category,
}: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultKeyword);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    // URLSearchParams: URL의 쿼리 문자열을 쉽게 생성하고 조작할 수 있도록 도와주는 웹 API (예: ?keyword=example&status=active)
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    if (status) {
      params.set("status", status);
    }

    if (category) {
      params.set("category", category);
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleReset() {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    if (category) {
      params.set("category", category);
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form className="flex w-full flex-col gap-3 sm:flex-row md:max-w-xl" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="상품명 또는 설명 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/30"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          검색
        </button>

        {defaultKeyword && (
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:bg-white/5"
          >
            초기화
          </button>
        )}
      </div>
    </form>
  );
}