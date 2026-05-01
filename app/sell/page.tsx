// use client: 이 컴포넌트가 클라이언트 측에서 렌더링되어야 함을 Next.js에 알리는 지시자입니다. 이를 통해 useState, useEffect와 같은 React 훅을 사용할 수 있습니다.
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/product.service";

type SaleType = "SALE" | "AUCTION";

export default function SellPage() {
  const router = useRouter();

  // useState<> : 상태의 타입을 명시적으로 지정. saleType은 "SALE" 또는 "AUCTION" 중 하나의 문자열 값을 가질 수 있음
  const [saleType, setSaleType] = useState<SaleType>("SALE");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  // currentPrice가 없는 이유: 상품 등록 시점에는 currentPrice가 아직 결정되지 않았음

  const [auctionStartTime, setAuctionStartTime] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  // isPending: 상품 등록 요청이 진행 중인지 여부를 나타내는 상태. true이면 요청이 진행 중이고, false이면 요청이 완료되었거나 아직 시작되지 않았음을 의미
  const [isPending, setIsPending] = useState(false);

  const isAuction = saleType === "AUCTION";

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

      if (images.length === 0) {
        throw new Error("상품 이미지를 1장 이상 업로드해주세요.");
      }

      if (isAuction) {
        const parsedStartPrice = Number(startPrice);
        const parsedBuyNowPrice = Number(buyNowPrice);

        if (!parsedStartPrice || parsedStartPrice <= 0) {
          throw new Error("시작 입찰가를 올바르게 입력해주세요.");
        }

        if (!parsedBuyNowPrice || parsedBuyNowPrice <= 0) {
          throw new Error("즉시 구매가를 올바르게 입력해주세요.");
        }

        if (parsedBuyNowPrice < parsedStartPrice) {
          throw new Error("즉시 구매가는 시작 입찰가보다 크거나 같아야 합니다.");
        }

        if (!auctionStartTime || !auctionEndTime) {
          throw new Error("경매 시작 시간과 종료 시간을 입력해주세요.");
        }

        await createProduct({
          title,
          description,
          category,
          startPrice: parsedStartPrice,
          currentPrice: parsedStartPrice,
          buyNowPrice: parsedBuyNowPrice,
          isAuction: true,
          auctionStartTime,
          auctionEndTime,
          images,
        });
      } else {
        const parsedPrice = Number(price);

        if (!parsedPrice || parsedPrice <= 0) {
          throw new Error("판매가를 올바르게 입력해주세요.");
        }

        await createProduct({
          title,
          description,
          category,
          buyNowPrice: parsedPrice,
          currentPrice: parsedPrice,
          isAuction: false,
          images,
        });
      }

      router.push("/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "상품 등록에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    // margin: 바깥쪽 여백, padding: 안쪽 여백
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Sell Product
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          상품 등록
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          일반 판매 또는 경매 상품으로 등록할 수 있습니다.
        </p>
      </div>

      <div className="luxury-panel p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* grid와 flex의 차이점: grid는 2차원 배열처럼 행과 열을 기준으로 요소를 배치하는 반면, flex는 1차원 배열처럼 한 줄에 요소를 배치함 */}
          <div className="grid gap-6 md:grid-cols-2">
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
              <label className="mb-2 block text-sm text-white/70">
                판매 방식
              </label>
              <select
                value={saleType}
                onChange={(e) => setSaleType(e.target.value as SaleType)}
                className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none"
              >
                <option value="SALE">일반 거래</option>
                <option value="AUCTION">경매</option>
              </select>
            </div>
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
                    onChange={(e) => setStartPrice(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    즉시 구매가
                  </label>
                  <input
                    type="number"
                    placeholder="즉시 구매가"
                    value={buyNowPrice}
                    onChange={(e) => setBuyNowPrice(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
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
                    onChange={(e) => setAuctionStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    경매 종료 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={auctionEndTime}
                    onChange={(e) => setAuctionEndTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-2 block text-sm text-white/70">판매가</label>
              <input
                type="number"
                placeholder="일반 상품 가격"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-white/70">
              이미지 업로드
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
            <p className="mt-2 text-xs text-white/45">
              이미지는 최대 10장까지 업로드할 수 있습니다.
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "등록 중..." : "상품 등록하기"}
          </button>
        </form>
      </div>
    </section>
  );
}