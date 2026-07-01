"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import {
  canEditProductImages,
  validateProductImagesAfterDelete,
} from "@/lib/product-image-policy";
import { getStoredAccessToken, getStoredUser } from "@/lib/storage";
import { getAuctionByProductId } from "@/services/auction.service";
import { getProductDetail, updateProduct } from "@/services/product.service";
import type { Auction } from "@/types/auction";
import type {
  Product,
  ProductEditImageState,
  UpdateProductParams,
} from "@/types/product";

type StoredUser = {
  userId: number;
} | null;

const MAX_IMAGE_COUNT = 10;

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();

  const rawProductId = Array.isArray(params.id) ? params.id[0] : params.id;
  const productId = Number(rawProductId);

  const [product, setProduct] = useState<Product | null>(null);
  const [auction, setAuction] = useState<Auction | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [auctionStartTime, setAuctionStartTime] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");

  const [imageState, setImageState] = useState<ProductEditImageState>({
    existingImages: [],
    deleteImageIds: [],
    newImages: [],
    thumbnailImageId: null,
  });

  const [originalThumbnailImageId, setOriginalThumbnailImageId] = useState<
    number | null
  >(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAuction = product?.status === "AUCTION";
  const isSold = product?.status === "SOLD";

  const auctionStatus = auction?.status ?? product?.auctionStatus ?? null;

  const isAuctionReady = isAuction && auctionStatus === "READY";
  const isAuctionRunning = isAuction && auctionStatus === "RUNNING";
  const isAuctionClosed =
    isAuction &&
    (auctionStatus === "FINISHED" ||
      auctionStatus === "FAILED" ||
      auctionStatus === "CANCELLED");

  const canEditBasicFields =
    !!product && !isSold && (!isAuction || isAuctionReady || isAuctionRunning);

  const canEditCategory = !!product && !isSold && (!isAuction || isAuctionReady);

  const canEditImages =
    !!product &&
    canEditProductImages({
      productStatus: product.status,
      auctionStatus,
    });

  const canEditStartPrice = !!product && isAuctionReady;
  const canEditBuyNowPrice = !!product && !isSold && (!isAuction || isAuctionReady);
  const canEditAuctionStartTime = !!product && isAuctionReady;
  const canEditAuctionEndTime = !!product && (isAuctionReady || isAuctionRunning);

  const remainingExistingImages = useMemo(
    () =>
      imageState.existingImages.filter(
        (image) => !imageState.deleteImageIds.includes(image.id),
      ),
    [imageState.deleteImageIds, imageState.existingImages],
  );

  const totalImageCount =
    remainingExistingImages.length + imageState.newImages.length;

  const hasImageChanges =
    imageState.deleteImageIds.length > 0 ||
    imageState.newImages.length > 0 ||
    imageState.thumbnailImageId !== originalThumbnailImageId;

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

        const thumbnailId =
          result.images.find((image) => image.isThumbnail)?.id ??
          result.images[0]?.id ??
          null;

        setOriginalThumbnailImageId(thumbnailId);
        setImageState({
          existingImages: result.images,
          deleteImageIds: [],
          newImages: [],
          thumbnailImageId: thumbnailId,
        });

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
            : "상품 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsCheckingAuth(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Array.from: FileList 객체를 배열로 변환
    // Filelist 객체: 사용자가 선택한 파일들의 목록을 나타내는 객체
    const files = Array.from(e.target.files ?? []);
    const nextTotalImageCount = remainingExistingImages.length + files.length;

    if (nextTotalImageCount > MAX_IMAGE_COUNT) {
      setErrorMessage(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setImageState((prev) => ({
      ...prev,
      newImages: files,
    }));
  }

  function handleToggleDeleteImage(imageId: number) {
    setImageState((prev) => {
      const isAlreadyDeleted = prev.deleteImageIds.includes(imageId);
      const nextDeleteImageIds = isAlreadyDeleted
        ? prev.deleteImageIds.filter((id) => id !== imageId)
        : [...prev.deleteImageIds, imageId];

      const isSelectedThumbnailDeleted =
        prev.thumbnailImageId !== null &&
        nextDeleteImageIds.includes(prev.thumbnailImageId);

      return {
        ...prev,
        deleteImageIds: nextDeleteImageIds,
        thumbnailImageId: isSelectedThumbnailDeleted
          ? null
          : prev.thumbnailImageId,
      };
    });
  }

  function handleSelectThumbnail(imageId: number) {
    setImageState((prev) => {
      if (prev.deleteImageIds.includes(imageId)) {
        return prev;
      }

      return {
        ...prev,
        thumbnailImageId: imageId,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    // preventDefault: 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    if (!product) return;

    try {
      setIsPending(true);
      setErrorMessage("");

      if (isSold) {
        throw new Error("판매 완료된 상품은 수정할 수 없습니다.");
      }

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

      if (canEditImages && hasImageChanges) {
        const isValidImageCount = validateProductImagesAfterDelete({
          existingImages: imageState.existingImages,
          deleteImageIds: imageState.deleteImageIds,
          newImagesCount: imageState.newImages.length,
        });

        if (!isValidImageCount) {
          throw new Error("상품 이미지는 최소 1장 이상 필요합니다.");
        }

        if (totalImageCount > MAX_IMAGE_COUNT) {
          throw new Error(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
        }
      }

      const payload: UpdateProductParams = {
        title,
        description,
      };

      if (canEditCategory) {
        payload.category = category;
      }

      if (canEditImages && hasImageChanges) {
        if (imageState.deleteImageIds.length > 0) {
          payload.deleteImageIds = imageState.deleteImageIds;
        }

        if (
          imageState.thumbnailImageId !== null &&
          imageState.thumbnailImageId !== originalThumbnailImageId
        ) {
          payload.thumbnailImageId = imageState.thumbnailImageId;
        }

        if (imageState.newImages.length > 0) {
          payload.newImages = imageState.newImages;
        }
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
            throw new Error(
              "진행 중인 경매의 종료 시간은 기존보다 뒤로만 수정할 수 있습니다.",
            );
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
        error instanceof Error ? error.message : "상품 수정에 실패했습니다.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-white/70">상품 정보를 확인하는 중입니다.</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-white/70">상품 정보를 불러올 수 없습니다.</p>
      </section>
    );
  }

  if (isSold || isAuctionClosed) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
          Edit Product
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          수정할 수 없는 상품입니다
        </h1>
        <p className="mt-4 text-white/60">
          판매 완료, 종료, 유찰, 취소된 상품은 수정할 수 없습니다.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/products/${productId}`)}
          className="mt-8 rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90"
        >
          상품 상세로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
          Edit Product
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">상품 수정</h1>
        <p className="mt-4 text-white/60">
          상품 상태에 따라 수정 가능한 항목만 변경할 수 있습니다.
        </p>

        {isAuction && auction && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/70">상품명</label>
            <input
              type="text"
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
                      진행 중인 경매의 종료 시간은 기존보다 뒤로만 수정할 수
                      있습니다.
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
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <label className="mb-3 block text-sm text-white/70">
                이미지 수정
              </label>

              {imageState.existingImages.length > 0 && (
                <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {imageState.existingImages.map((image) => {
                    const isDeleted = imageState.deleteImageIds.includes(
                      image.id,
                    );
                    const isThumbnail =
                      imageState.thumbnailImageId === image.id && !isDeleted;

                    return (
                      <div
                        key={image.id}
                        className={`rounded-2xl border p-3 ${
                          isDeleted
                            ? "border-red-400/40 bg-red-500/10 opacity-60"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div
                          className="h-32 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${image.imageUrl})` }}
                        />

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDeleteImage(image.id)}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/5"
                          >
                            {isDeleted ? "삭제 취소" : "삭제 예정"}
                          </button>

                          <button
                            type="button"
                            disabled={isDeleted}
                            onClick={() => handleSelectThumbnail(image.id)}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/5 disabled:opacity-40"
                          >
                            {isThumbnail ? "현재 썸네일" : "썸네일 지정"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />

              {imageState.newImages.length > 0 && (
                <p className="mt-3 text-xs text-white/60">
                  새 이미지 {imageState.newImages.length}장이 추가될 예정입니다.
                </p>
              )}

              <p className="mt-2 text-xs text-white/45">
                기존 이미지는 기본적으로 유지됩니다. 삭제할 이미지는 삭제
                예정으로 표시하고, 새 이미지는 최종 수정 요청 시 함께
                추가합니다. 현재 이미지 수: {totalImageCount} /{" "}
                {MAX_IMAGE_COUNT}
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