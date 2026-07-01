"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useBidMutation } from "@/hooks/mutations/useBidMutation";
import { getBidAmountError } from "@/lib/auction-policy";
import { formatPrice } from "@/lib/format";

type Props = {
  auctionId: number;
  productId?: number;
  currentPrice: number;
  buyNowPrice?: number | null;
};

export default function BidForm({
  auctionId,
  productId,
  currentPrice,
  buyNowPrice,
}: Props) {
  const router = useRouter();

  const [bidPrice, setBidPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const bidMutation = useBidMutation({
    auctionId,
    productId,
  });

  async function handleSubmit(e: React.FormEvent) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      // TanStack Query mutation의 isPending을 사용하여 버튼을 비활성화하고,
      // 사용자에게 입찰이 처리 중임을 시각적으로 표시
      setErrorMessage("");

      const parsedBidPrice = Number(bidPrice);

      const bidAmountError = getBidAmountError({
        bidAmount: parsedBidPrice,
        currentPrice,
        buyNowPrice,
      });

      if (bidAmountError) {
        throw new Error(bidAmountError);
      }

      await bidMutation.mutateAsync({
        bidPrice: parsedBidPrice,
      });

      setBidPrice("");

      // 입찰 성공 후 서버 컴포넌트 데이터를 다시 불러오기 위해 refresh
      // (중요) Tanstack Query의 invalidate와 router.refresh()가 갱신하는 대상이 다름
      // 따라서 invalidateQueries()로 캐시를 무효화한 후, router.refresh()로 서버 컴포넌트 데이터를 다시 불러와야 함
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "입찰에 실패했습니다.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <label className="block text-sm text-white/70">입찰 금액 입력</label>

      <input
        type="number"
        value={bidPrice}
        disabled={bidMutation.isPending}
        placeholder={`${formatPrice(currentPrice)}보다 높은 금액`}
        onChange={(e) => setBidPrice(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
      />

      {buyNowPrice !== undefined && buyNowPrice !== null && (
        <p className="text-xs text-white/45">
          즉시 구매가 {formatPrice(buyNowPrice)}를 초과할 수 없습니다.
        </p>
      )}

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={bidMutation.isPending}
        className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
      >
        {bidMutation.isPending ? "입찰 중..." : "입찰하기"}
      </button>
    </form>
  );
}