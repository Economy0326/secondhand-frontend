"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useLikeMutation } from "@/hooks/mutations/useLikeMutation";
import { queryKeys } from "@/lib/query-keys";
import {
  getIsProductLiked,
  getProductLikeCount,
} from "@/services/like.service";

type Props = {
  productId: number;
};

function normalizeCount(value: number | Record<string, unknown>) {
  if (typeof value === "number") return value;

  // firstValue를 따로 설정한 이유: API 응답이 { count: number } 또는 { liked: boolean } 형태로 올 수 있기 때문에,
  // 객체에서 첫 번째 값을 추출하여 사용하기 위함
  const firstValue = Object.values(value)[0];

  return typeof firstValue === "number" ? firstValue : 0;
}

function normalizeLiked(value: boolean | Record<string, unknown>) {
  if (typeof value === "boolean") return value;

  const firstValue = Object.values(value)[0];

  return typeof firstValue === "boolean" ? firstValue : false;
}

export default function LikeButton({ productId }: Props) {
  const [errorMessage, setErrorMessage] = useState("");

  const likeCountQuery = useQuery({
    queryKey: queryKeys.productLikeCount(productId),
    queryFn: async () => {
      const countResult = await getProductLikeCount(productId);

      return normalizeCount(countResult);
    },
  });

  const likeStatusQuery = useQuery({
    queryKey: queryKeys.productLikeStatus(productId),
    queryFn: async () => {
      try {
        const likedResult = await getIsProductLiked(productId);

        return normalizeLiked(likedResult);
      } catch {
        // 로그인하지 않은 사용자는 찜 여부 조회가 실패할 수 있으므로 조용히 무시
        return false;
      }
    },
    retry: false,
  });

  const likeMutation = useLikeMutation({ productId });

  const isLiked = likeStatusQuery.data ?? false;
  const likeCount = likeCountQuery.data ?? 0;
  const isPending =
    likeCountQuery.isLoading ||
    likeStatusQuery.isLoading ||
    likeMutation.isPending;

  function handleToggleLike() {
    setErrorMessage("");

    // 버튼 클릭시 찜 상태를 즉시 반영하기 위해 optimistic update를 수행
    likeMutation.mutate(
      {
        nextLiked: !isLiked,
        previousLiked: isLiked,
        previousCount: likeCount,
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error ? error.message : "찜 처리에 실패했습니다.",
          );
        },
      },
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggleLike}
        className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-60"
      >
        {isPending
          ? "처리 중..."
          : isLiked
            ? `찜 취소 ♥ ${likeCount}`
            : `찜하기 ♡ ${likeCount}`}
      </button>

      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}