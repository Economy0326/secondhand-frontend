"use client";

import { useEffect, useState } from "react";
import {
  getIsProductLiked,
  getProductLikeCount,
  likeProduct,
  unlikeProduct,
} from "@/services/like.service";

type Props = {
  productId: number;
};

function normalizeCount(value: number | Record<string, number>) {
  if (typeof value === "number") return value;

  // firstValue를 따로 설정한 이유: API 응답이 { count: number } 또는 { liked: boolean } 형태로 올 수 있기 때문에, 객체에서 첫 번째 값을 추출하여 사용하기 위함
  const firstValue = Object.values(value)[0];
  return typeof firstValue === "number" ? firstValue : 0;
}

function normalizeLiked(value: boolean | Record<string, boolean>) {
  if (typeof value === "boolean") return value;

  const firstValue = Object.values(value)[0];
  return typeof firstValue === "boolean" ? firstValue : false;
}

export default function LikeButton({ productId }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLikeInfo() {
      try {
        const countResult = await getProductLikeCount(productId);
        setLikeCount(normalizeCount(countResult));

        const likedResult = await getIsProductLiked(productId);
        setIsLiked(normalizeLiked(likedResult));
      } catch {
        // 로그인하지 않은 사용자는 찜 여부 조회가 실패할 수 있으므로 조용히 무시
        try {
          const countResult = await getProductLikeCount(productId);
          setLikeCount(normalizeCount(countResult));
        } catch {
          setLikeCount(0);
        }
      }
    }

    loadLikeInfo();
  }, [productId]);

  async function handleToggleLike() {
    try {
      setIsPending(true);
      setErrorMessage("");

      if (isLiked) {
        // unlikeProduct: API를 호출하여 해당 상품에 대한 찜을 취소하는 함수
        await unlikeProduct(productId);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        // likeProduct: API를 호출하여 해당 상품에 대한 찜을 추가하는 함수
        await likeProduct(productId);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "찜 처리에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={isPending}
        className={`w-full rounded-full px-6 py-3 font-semibold transition disabled:opacity-60 ${
          isLiked
            ? "border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]"
            : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
        }`}
      >
        {isPending ? "처리 중..." : isLiked ? `찜 취소 ♥ ${likeCount}` : `찜하기 ♡ ${likeCount}`}
      </button>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
}