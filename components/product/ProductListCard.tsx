import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import { formatPrice } from "@/lib/format";

type Props = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  isAuction: boolean;
  currentPrice?: number;
  buyNowPrice?: number | null;
  startPrice?: number | null;
  likes?: number;
  status?: "READY" | "RUNNING" | "FINISHED" | "FAILED" | "CANCELLED";
};
// 추가로 렌더링 할 때는 formatPrice 함수를 이용

export default function ProductListCard({
  id,
  title,
  description,
  imageUrl,
  isAuction,
  currentPrice,
  buyNowPrice,
  startPrice,
  likes = 0,
  status,
}: Props) {
  return (
    <Link
      href={`/products/${id}`}
      className="luxury-panel block overflow-hidden p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]/30"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          // aspect-[4/3]: 가로 세로 비율을 4:3으로 유지
          className="aspect-[4/3] w-full rounded-[20px] object-cover"
        />
      ) : (
        <div className="aspect-[4/3] rounded-[20px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />
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
                  {status === "FINISHED" ? "최종 가격" : "현재 입찰가"}
                </p>
                <p className="text-xl font-semibold text-white">
                  {currentPrice !== undefined ? formatPrice(currentPrice) : "-"}
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