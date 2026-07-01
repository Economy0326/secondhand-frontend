import Link from "next/link";

import AuctionExpirationRefetch from "@/components/auction/AuctionExpirationRefetch";
import StatusBadge from "@/components/common/StatusBadge";
import { formatPrice } from "@/lib/format";
import {
  getAuctionPriceLabel,
  getAuctionTimeText,
} from "@/lib/auction-ui";

type Props = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  isAuction: boolean;
  currentPrice?: number;
  currentBidPrice?: number;
  startPrice?: number | null;
  buyNowPrice?: number | null;
  likes?: number;
  status?: "READY" | "RUNNING" | "FINISHED" | "FAILED" | "CANCELLED";
  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
};

// 추가로 렌더링 할 때는 formatPrice 함수를 이용
export default function ProductListCard({
  id,
  title,
  description,
  imageUrl,
  isAuction,
  currentPrice,
  currentBidPrice,
  startPrice,
  buyNowPrice,
  likes = 0,
  status,
  auctionStartTime,
  auctionEndTime,
}: Props) {
  const displayCurrentPrice = currentPrice ?? currentBidPrice;

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:bg-white/[0.05]">
      {isAuction && (
        <AuctionExpirationRefetch
          productId={id}
          status={status}
          endTime={auctionEndTime}
        />
      )}

      <Link href={`/products/${id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-white/5">
          {imageUrl ? (
            <div
              className="h-full bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/35">
              이미지 준비 중
            </div>
          )}

          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
              {isAuction ? "Auction Item" : "Secondhand Item"}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              {isAuction ? (
                status ? (
                  <StatusBadge status={status} />
                ) : (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    경매 상품
                  </span>
                )
              ) : (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                  일반 거래
                </span>
              )}
            </div>

            <span className="text-xs text-white/45">♥ {likes}</span>
          </div>

          {/* 남은 시간 표시 */}
          {isAuction && status && (
            <p className="min-h-[20px] text-sm font-semibold text-[var(--accent)]">
              {getAuctionTimeText({
                status,
                startTime: auctionStartTime,
                endTime: auctionEndTime,
              })}
            </p>
          )}

          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-white">
              {title}
            </h3>

            {/* line-clamp-2: 최대 2줄까지만 보이도록, 넘치는 부분은 ...으로 처리 */}
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
              {description}
            </p>
          </div>

          {isAuction ? (
            <div className="space-y-2">
              <div>
                <p className="text-xs text-white/45">
                  {getAuctionPriceLabel(status)}
                </p>
                <p className="text-xl font-bold text-white">
                  {displayCurrentPrice !== undefined
                    ? formatPrice(displayCurrentPrice)
                    : "-"}
                </p>
              </div>

              {startPrice !== undefined && startPrice !== null && (
                <div className="flex justify-between text-sm text-white/50">
                  <span>시작 입찰가</span>
                  <span>{formatPrice(startPrice)}</span>
                </div>
              )}

              {buyNowPrice !== undefined && buyNowPrice !== null && (
                <div className="flex justify-between text-sm text-white/50">
                  <span>즉시 구매가</span>
                  <span>{formatPrice(buyNowPrice)}</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-xs text-white/45">판매가</p>
              <p className="text-xl font-bold text-white">
                {buyNowPrice !== undefined && buyNowPrice !== null
                  ? formatPrice(buyNowPrice)
                  : "-"}
              </p>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}