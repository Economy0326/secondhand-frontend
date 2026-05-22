"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStoredUser } from "@/lib/storage";
import { cancelAuction } from "@/services/auction.service";
import { deleteProduct } from "@/services/product.service";
import { Auction, AuctionStatus } from "@/types/auction";

type Props = {
  productId: number;
  sellerId: number;
  auction?: Auction | null;
};

type StoredUser = {
  userId: number;
} | null;

function isAuctionCancelable(status: AuctionStatus, startTime: string) {
  if (status === "READY") return true;

  if (status === "RUNNING") {
    const start = new Date(startTime).getTime();
    // 데드라인 계산법: 시작 시간 + 1시간
    const deadline = start + 60 * 60 * 1000;
    const now = Date.now();

    return now <= deadline;
  }

  return false;
}

export default function ProductOwnerActions({
  productId,
  sellerId,
  auction,
}: Props) {
  const router = useRouter();

  // delete와 cancel의 차이: delete는 상품 자체를 삭제하는 것이고, cancel은 경매만 취소하는 것
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancellingAuction, setIsCancellingAuction] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = getStoredUser() as StoredUser;
  const isOwner = user?.userId === sellerId;

  if (!isOwner) return null;

  const canCancelAuction = auction
    ? isAuctionCancelable(auction.status, auction.startTime)
    : false;

  async function handleDelete() {
    const confirmed = window.confirm(
      "정말 이 상품을 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");

      await deleteProduct(productId);

      router.replace("/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "상품 삭제에 실패했습니다."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCancelAuction() {
    if (!auction) return;

    const confirmed = window.confirm(
      "정말 이 경매를 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다."
    );

    if (!confirmed) return;

    try {
      setIsCancellingAuction(true);
      setErrorMessage("");

      await cancelAuction(auction.id);

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "경매 취소에 실패했습니다."
      );
    } finally {
      setIsCancellingAuction(false);
    }
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="mb-3 text-sm text-white/45">판매자 관리</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/products/${productId}/edit`}
          className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
        >
          상품 수정
        </Link>

        {auction && canCancelAuction && (
          <button
            type="button"
            onClick={handleCancelAuction}
            disabled={isCancellingAuction}
            className="rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/15 disabled:opacity-60"
          >
            {isCancellingAuction ? "취소 중..." : "경매 취소"}
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full border border-red-400/30 bg-red-400/10 px-5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:opacity-60"
        >
          {isDeleting ? "삭제 중..." : "상품 삭제"}
        </button>
      </div>

      {auction && !canCancelAuction && auction.status !== "CANCELLED" && (
        <p className="mt-3 text-xs text-white/45">
          경매 취소는 시작 전 또는 시작 후 1시간 이내에만 가능합니다.
        </p>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}