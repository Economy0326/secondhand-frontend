import Link from "next/link";
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
    <Link
      href={`/products/${id}`}
      className="luxury-panel block overflow-hidden p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]/30"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="aspect-[4/3] w-full rounded-[20px] object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#2b3348,#171b26)]">
          <div className="text-center">
            <p className="text-sm font-semibold text-white/60">이미지 준비 중</p>
            <p className="mt-1 text-xs text-white/35">
              {isAuction ? "Auction Item" : "Secondhand Item"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAuction ? (
              status ? (
                <StatusBadge status={status} />
              ) : (
                <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]">
                  경매 상품
                </span>
              )
            ) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                일반 거래
              </span>
            )}
          </div>

          <span className="text-sm text-white/50">♥ {likes}</span>
        </div>

        {/* 남은 시간 표시 */}
        {isAuction && status && (
          <p className="mb-3 text-xs text-white/45">
            {getAuctionTimeText({
              status,
              startTime: auctionStartTime,
              endTime: auctionEndTime,
            })}
          </p>
        )}

        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {/* line-clamp-2: 최대 2줄까지만 보이도록, 넘치는 부분은 ...으로 처리 */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
          {description}
        </p>

        <div className="mt-5 space-y-2">
          {isAuction ? (
            <>
              <div>
                <p className="text-xs text-white/45">
                  {getAuctionPriceLabel(status)}
                </p>
                <p className="text-xl font-semibold text-white">
                  {displayCurrentPrice !== undefined
                    ? formatPrice(displayCurrentPrice)
                    : "-"}
                </p>
              </div>

              {startPrice !== undefined && startPrice !== null && (
                <div>
                  <p className="text-xs text-white/45">시작 입찰가</p>
                  <p className="text-base font-medium text-white/80">
                    {formatPrice(startPrice)}
                  </p>
                </div>
              )}

              {buyNowPrice !== undefined && buyNowPrice !== null && (
                <div>
                  <p className="text-xs text-white/45">즉시 구매가</p>
                  <p className="text-base font-medium text-[var(--accent)]">
                    {formatPrice(buyNowPrice)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              <p className="text-xs text-white/45">판매가</p>
              <p className="text-xl font-semibold text-white">
                {buyNowPrice !== undefined && buyNowPrice !== null
                  ? formatPrice(buyNowPrice)
                  : "-"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}