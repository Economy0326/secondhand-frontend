"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStoredUser } from "@/lib/storage";
import { deleteProduct } from "@/services/product.service";

type Props = {
  productId: number;
  sellerId: number;
};

type StoredUser = {
  userId: number;
} | null;

export default function ProductOwnerActions({ productId, sellerId }: Props) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = getStoredUser() as StoredUser;
  const isOwner = user?.userId === sellerId;

  if (!isOwner) return null;

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

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full border border-red-400/30 bg-red-400/10 px-5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:opacity-60"
        >
          {isDeleting ? "삭제 중..." : "상품 삭제"}
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}