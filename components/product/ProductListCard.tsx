import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

type Props = {
  id: number;
  title: string;
  description: string;
  isAuction: boolean;
  price?: string;
  currentBidPrice?: string;
  buyNowPrice?: string;
  likes: number;
  status?: "READY" | "RUNNING" | "FINISHED";
};

export default function ProductListCard({
  id,
  title,
  description,
  isAuction,
  price,
  currentBidPrice,
  buyNowPrice,
  likes,
  status,
}: Props) {
  return (
    <Link
      href={`/products/${id}`}
      className="luxury-panel block overflow-hidden p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]/30"
    >
      
      {/* 이미지 영역의 크기와 비율을 먼저 div로 잡아둔 것 */}
      <div className="aspect-[4/3] rounded-[20px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAuction ? (
              status ? (
                <StatusBadge status={status} />
              ) : null
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
                <p className="text-xs text-white/45">현재 입찰가</p>
                <p className="text-xl font-semibold text-white">
                  {currentBidPrice}
                </p>
              </div>

              {buyNowPrice && (
                <div>
                  <p className="text-xs text-white/45">즉시 구매가</p>
                  <p className="text-base font-medium text-[var(--accent)]">
                    {buyNowPrice}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div>
              <p className="text-xs text-white/45">판매가</p>
              <p className="text-xl font-semibold text-white">{price}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}