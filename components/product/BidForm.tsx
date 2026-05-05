"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBid } from "@/services/bid.service";
import { formatPrice } from "@/lib/format";

type Props = {
  auctionId: number;
  currentPrice: number;
  buyNowPrice?: number | null;
};

export default function BidForm({
  auctionId,
  currentPrice,
  buyNowPrice,
}: Props) {
  const router = useRouter();

  const [bidPrice, setBidPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      // setIsPending(true): 진행 중 상태로 변경하여 버튼을 비활성화하고, 사용자에게 입찰이 처리 중임을 시각적으로 표시
      setIsPending(true);
      setErrorMessage("");

      const parsedBidPrice = Number(bidPrice);

      if (!parsedBidPrice || parsedBidPrice <= 0) {
        throw new Error("입찰 금액을 올바르게 입력해주세요.");
      }

      if (parsedBidPrice <= currentPrice) {
        throw new Error(
          `현재 입찰가 ${formatPrice(currentPrice)}보다 높은 금액을 입력해주세요.`
        );
      }

      if (buyNowPrice !== undefined && buyNowPrice !== null) {
        if (parsedBidPrice > buyNowPrice) {
          throw new Error(
            `입찰 금액은 즉시 구매가 ${formatPrice(buyNowPrice)}를 초과할 수 없습니다.`
          );
        }
      }

      await createBid(auctionId, {
        bidPrice: parsedBidPrice,
      });

      setBidPrice("");

      // 입찰 성공 후 서버 컴포넌트 데이터를 다시 불러오기 위해 refresh
      // 컴포넌트 데이터를 다시 불러오는 이유: 입찰이 성공하면 현재 입찰가가 변경되므로, 변경된 입찰가를 반영하기 위해 데이터를 다시 불러와야 함
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "입찰에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-white/10 bg-[#0f1420] p-4">
        <label className="mb-2 block text-sm text-white/70">
          입찰 금액 입력
        </label>
        <input
          type="number"
          placeholder="현재 입찰가보다 높은 금액을 입력하세요"
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
        />

        {buyNowPrice !== undefined && buyNowPrice !== null && (
          <p className="mt-2 text-xs text-white/45">
            즉시 구매가 {formatPrice(buyNowPrice)}를 초과할 수 없습니다.
          </p>
        )}
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "입찰 중..." : "입찰하기"}
      </button>
    </form>
  );
}