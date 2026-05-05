"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getStoredAccessToken, getStoredUser } from "@/lib/storage";
import { getProductDetail, updateProduct } from "@/services/product.service";
import { Product } from "@/types/product";

type StoredUser = {
  userId: number;
} | null;

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const token = getStoredAccessToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const result = await getProductDetail(productId);
        const user = getStoredUser() as StoredUser;

        if (!user || user.userId !== result.sellerId) {
          router.replace(`/products/${productId}`);
          return;
        }

        setProduct(result);
        setTitle(result.title);
        setDescription(result.description);
        setCategory(result.category);
        setBuyNowPrice(String(result.buyNowPrice));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "상품 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsCheckingAuth(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      setIsPending(true);
      setErrorMessage("");

      if (!title.trim()) {
        throw new Error("상품명을 입력해주세요.");
      }

      if (!description.trim()) {
        throw new Error("상품 설명을 입력해주세요.");
      }

      if (!category.trim()) {
        throw new Error("카테고리를 입력해주세요.");
      }

      const parsedBuyNowPrice = Number(buyNowPrice);

      if (!parsedBuyNowPrice || parsedBuyNowPrice <= 0) {
        throw new Error("가격을 올바르게 입력해주세요.");
      }

      await updateProduct(productId, {
        title,
        description,
        category,
        buyNowPrice: parsedBuyNowPrice,
      });

      router.push(`/products/${productId}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "상품 수정에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="luxury-panel p-8 text-center">
          <p className="text-white/70">상품 정보를 확인하는 중입니다.</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-default py-12 md:py-16">
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">상품 정보를 불러올 수 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    // margin: 바깥쪽 여백, padding: 안쪽 여백
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Edit Product
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          상품 수정
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          등록한 상품의 기본 정보를 수정할 수 있습니다.
        </p>
      </div>

      <div className="luxury-panel p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-white/70">상품명</label>
            <input
              type="text"
              placeholder="상품명을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">카테고리</label>
            <input
              type="text"
              placeholder="예: 전자기기, 여행 용품, 자동차 용품"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">상품 설명</label>
            <textarea
              placeholder="상품 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">
              {product.status === "AUCTION" ? "즉시 구매가" : "판매가"}
            </label>
            <input
              type="number"
              placeholder="가격을 입력하세요"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
            {product.status === "AUCTION" && (
              <p className="mt-2 text-xs text-white/45">
                경매 상품의 현재 입찰가와 시작가는 수정하지 않습니다.
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "수정 중..." : "상품 수정하기"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-white/10 px-8 py-3 font-semibold text-white/80 transition hover:bg-white/5"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}