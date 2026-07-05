import Link from "next/link";

import AuctionExpirationRefetch from "@/components/auction/AuctionExpirationRefetch";
import StatusBadge from "@/components/common/StatusBadge";
import { getAuctionPriceLabel, getAuctionTimeText } from "@/lib/auction-ui";
import { formatPrice } from "@/lib/format";

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
    <Link
      href={`/products/${id}`}
      className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:bg-white/[0.05]"
    >
      {isAuction && (
        <AuctionExpirationRefetch
          productId={id}
          status={status}
          endTime={auctionEndTime}
        />
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
        {imageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
            이미지 준비 중
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            {isAuction ? "Auction Item" : "Secondhand Item"}
          </span>

          <div className="flex items-center gap-2">
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

            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
              ♥ {likes}
            </span>
          </div>
        </div>

        {/* 남은 시간 표시 */}
        {isAuction && status && (
          <p className="min-h-[20px] min-w-[160px] text-sm font-semibold text-[var(--accent)]">
            {getAuctionTimeText({
              status,
              startTime: auctionStartTime,
              endTime: auctionEndTime,
            })}
          </p>
        )}

        <h3 className="line-clamp-1 text-lg font-semibold text-white">
          {title}
        </h3>

        {/* line-clamp-2: 최대 2줄까지만 보이도록, 넘치는 부분은 ...으로 처리 */}
        <p className="line-clamp-2 min-h-[44px] text-sm leading-6 text-white/55">
          {description}
        </p>

        {isAuction ? (
          <div className="space-y-1">
            <p className="text-sm text-white/45">{getAuctionPriceLabel(status)}</p>
            <p className="text-xl font-bold text-white">
              {displayCurrentPrice !== undefined
                ? formatPrice(displayCurrentPrice)
                : "-"}
            </p>

            {startPrice !== undefined && startPrice !== null && (
              <p className="text-xs text-white/40">
                시작 입찰가 {formatPrice(startPrice)}
              </p>
            )}

            {buyNowPrice !== undefined && buyNowPrice !== null && (
              <p className="text-xs text-white/40">
                즉시 구매가 {formatPrice(buyNowPrice)}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-white/45">판매가</p>
            <p className="text-xl font-bold text-white">
              {buyNowPrice !== undefined && buyNowPrice !== null
                ? formatPrice(buyNowPrice)
                : "-"}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}