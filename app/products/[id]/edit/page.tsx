"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { getStoredAccessToken, getStoredUser } from "@/lib/storage";
import { getAuctionByProductId } from "@/services/auction.service";
import { getProductDetail, updateProduct } from "@/services/product.service";
import { Auction } from "@/types/auction";
import { Product } from "@/types/product";

type StoredUser = {
  userId: number;
} | null;

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [auction, setAuction] = useState<Auction | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [startPrice, setStartPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");

  const [auctionStartTime, setAuctionStartTime] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");

  const [images, setImages] = useState<File[]>([]);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAuction = product?.status === "AUCTION";

  const auctionStatus = auction?.status;

  const isAuctionReady = isAuction && auctionStatus === "READY";
  const isAuctionRunning = isAuction && auctionStatus === "RUNNING";
  const isAuctionClosed =
    isAuction &&
    (auctionStatus === "FINISHED" ||
      auctionStatus === "FAILED" ||
      auctionStatus === "CANCELLED");

  // 일반 상품: title, description, category, buyNowPrice, images 수정 가능
  // 경매 READY: title, description, category, startPrice, buyNowPrice, auctionStartTime, auctionEndTime, images 수정 가능
  // 경매 RUNNING:title, description, auctionEndTime만 수정 가능,auctionEndTime은 기존 종료 시간보다 뒤로만 가능
  // 경매 FINISHED / FAILED / CANCELLED:수정 불가
  const canEditBasicFields = !isAuction || isAuctionReady || isAuctionRunning;
  const canEditCategory = !isAuction || isAuctionReady;
  const canEditImages = !isAuction || isAuctionReady;
  const canEditStartPrice = isAuctionReady;
  const canEditBuyNowPrice = !isAuction || isAuctionReady;
  const canEditAuctionStartTime = isAuctionReady;
  const canEditAuctionEndTime = isAuctionReady || isAuctionRunning;

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

        try {
          const auctionResult = await getAuctionByProductId(productId);
          setAuction(auctionResult);
          setStartPrice(String(auctionResult.startPrice));
          setAuctionStartTime(toDateTimeLocalValue(auctionResult.startTime));
          setAuctionEndTime(toDateTimeLocalValue(auctionResult.endTime));
        } catch {
          setAuction(null);
        }
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

  function toDateTimeLocalValue(value: string) {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Array.from: 유사 배열 객체나 반복 가능한 객체를 실제 배열로 변환하는 메서드
    const files = Array.from(e.target.files ?? []);

    if (files.length > 10) {
      setErrorMessage("이미지는 최대 10장까지 업로드할 수 있습니다.");
      return;
    }

    setImages(files);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    if (!product) return;

    try {
      setIsPending(true);
      setErrorMessage("");

      if (isAuctionClosed) {
        throw new Error("종료, 유찰, 취소된 경매 상품은 수정할 수 없습니다.");
      }

      if (!title.trim()) {
        throw new Error("상품명을 입력해주세요.");
      }

      if (!description.trim()) {
        throw new Error("상품 설명을 입력해주세요.");
      }

      if (canEditCategory && !category.trim()) {
        throw new Error("카테고리를 선택해주세요.");
      }

      const payload: {
        title?: string;
        description?: string;
        category?: string;
        startPrice?: number;
        buyNowPrice?: number;
        auctionStartTime?: string;
        auctionEndTime?: string;
        images?: File[];
      } = {
        title,
        description,
      };

      if (canEditCategory) {
        payload.category = category;
      }

      if (canEditImages && images.length > 0) {
        payload.images = images;
      }

      if (canEditBuyNowPrice) {
        const parsedBuyNowPrice = Number(buyNowPrice);

        if (!parsedBuyNowPrice || parsedBuyNowPrice <= 0) {
          throw new Error("즉시 구매가 또는 판매가를 올바르게 입력해주세요.");
        }

        payload.buyNowPrice = parsedBuyNowPrice;
      }

      if (canEditStartPrice) {
        const parsedStartPrice = Number(startPrice);

        if (!parsedStartPrice || parsedStartPrice <= 0) {
          throw new Error("시작 입찰가를 올바르게 입력해주세요.");
        }

        payload.startPrice = parsedStartPrice;
      }

      if (canEditAuctionStartTime) {
        if (!auctionStartTime) {
          throw new Error("경매 시작 시간을 입력해주세요.");
        }

        payload.auctionStartTime = auctionStartTime;
      }

      if (canEditAuctionEndTime) {
        if (!auctionEndTime) {
          throw new Error("경매 종료 시간을 입력해주세요.");
        }

        if (isAuctionRunning && auction) {
          const originalEndTime = new Date(auction.endTime).getTime();
          const nextEndTime = new Date(auctionEndTime).getTime();

          if (nextEndTime <= originalEndTime) {
            throw new Error("진행 중인 경매의 종료 시간은 기존보다 뒤로만 수정할 수 있습니다.");
          }
        }

        payload.auctionEndTime = auctionEndTime;
      }

      if (isAuctionReady && payload.startPrice && payload.buyNowPrice) {
        if (payload.buyNowPrice < payload.startPrice) {
          throw new Error("즉시 구매가는 시작 입찰가보다 크거나 같아야 합니다.");
        }
      }

      await updateProduct(productId, payload);

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

  if (isAuctionClosed) {
    return (
      <section className="container-default py-12 md:py-16">
        <div className="luxury-panel p-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
            Edit Product
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            수정할 수 없는 상품입니다
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/60">
            종료, 유찰, 취소된 경매 상품은 수정할 수 없습니다.
          </p>

          <button
            type="button"
            onClick={() => router.push(`/products/${productId}`)}
            className="mt-8 rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90"
          >
            상품 상세로 돌아가기
          </button>
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
          상품 상태에 따라 수정 가능한 항목만 변경할 수 있습니다.
        </p>
      </div>

      <div className="luxury-panel p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isAuction && auction && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
              <p>경매 상태: {auction.status}</p>
              {isAuctionRunning && (
                <p className="mt-2">
                  진행 중인 경매는 상품명, 설명, 종료 시간만 수정할 수 있습니다.
                </p>
              )}
              {isAuctionReady && (
                <p className="mt-2">
                  시작 전 경매는 가격, 시간, 이미지까지 수정할 수 있습니다.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-white/70">상품명</label>
            <input
              type="text"
              placeholder="상품명을 입력하세요"
              value={title}
              disabled={!canEditBasicFields}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 disabled:text-white/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">카테고리</label>
            <select
              value={category}
              disabled={!canEditCategory}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none disabled:text-white/40"
            >
              <option value="">카테고리를 선택하세요</option>
              {PRODUCT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {!canEditCategory && (
              <p className="mt-2 text-xs text-white/45">
                진행 중인 경매는 카테고리를 수정할 수 없습니다.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">상품 설명</label>
            <textarea
              placeholder="상품 설명을 입력하세요"
              value={description}
              disabled={!canEditBasicFields}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30 disabled:text-white/40"
            />
          </div>

          {isAuction ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    시작 입찰가
                  </label>
                  <input
                    type="number"
                    placeholder="경매 시작가"
                    value={startPrice}
                    disabled={!canEditStartPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 disabled:text-white/40"
                  />
                  {!canEditStartPrice && (
                    <p className="mt-2 text-xs text-white/45">
                      시작 입찰가는 시작 전 경매에서만 수정할 수 있습니다.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    즉시 구매가
                  </label>
                  <input
                    type="number"
                    placeholder="즉시 구매가"
                    value={buyNowPrice}
                    disabled={!canEditBuyNowPrice}
                    onChange={(e) => setBuyNowPrice(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 disabled:text-white/40"
                  />
                  {!canEditBuyNowPrice && (
                    <p className="mt-2 text-xs text-white/45">
                      진행 중인 경매는 즉시 구매가를 수정할 수 없습니다.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    경매 시작 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={auctionStartTime}
                    disabled={!canEditAuctionStartTime}
                    onChange={(e) => setAuctionStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none disabled:text-white/40"
                  />
                  {!canEditAuctionStartTime && (
                    <p className="mt-2 text-xs text-white/45">
                      진행 중인 경매는 시작 시간을 수정할 수 없습니다.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    경매 종료 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={auctionEndTime}
                    disabled={!canEditAuctionEndTime}
                    onChange={(e) => setAuctionEndTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none disabled:text-white/40"
                  />
                  {isAuctionRunning && (
                    <p className="mt-2 text-xs text-white/45">
                      진행 중인 경매의 종료 시간은 기존보다 뒤로만 수정할 수 있습니다.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-2 block text-sm text-white/70">판매가</label>
              <input
                type="number"
                placeholder="일반 상품 가격"
                value={buyNowPrice}
                disabled={!canEditBuyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 disabled:text-white/40"
              />
            </div>
          )}

          {canEditImages && (
            <div>
              <label className="mb-2 block text-sm text-white/70">
                이미지 수정
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />
              <p className="mt-2 text-xs text-white/45">
                이미지를 선택하면 기존 이미지가 백엔드 정책에 따라 교체됩니다.
                최대 10장까지 업로드할 수 있습니다.
              </p>
            </div>
          )}

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