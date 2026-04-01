import StatusBadge from "../common/StatusBadge";

type Props = {
  id: number;
  title: string;
  status: "READY" | "RUNNING" | "FINISHED";
  currentPrice: string;
  buyNowPrice?: string;
  likes: number;
};

export default function LuxuryProductCard({
  title,
  status,
  currentPrice,
  buyNowPrice,
  likes,
}: Props) {
  return (
    <article className="luxury-panel overflow-hidden p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]/30">
      
      {/* 이미지 영역의 크기와 비율을 먼저 div로 잡아둔 것 */}
      <div className="aspect-[4/3] rounded-[20px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <StatusBadge status={status} />

          <span className="text-sm text-white/50">♥ {likes}</span>
        </div>

        <h3 className="text-lg font-semibold text-white">{title}</h3>

        <div className="mt-5 space-y-2">
          <div>
            <p className="text-xs text-white/45">현재 입찰가</p>
            <p className="text-xl font-semibold text-white">{currentPrice}</p>
          </div>

          {buyNowPrice && (
            <div>
              <p className="text-xs text-white/45">즉시 구매가</p>
              <p className="text-base font-medium text-[var(--accent)]">
                {buyNowPrice}
              </p>
            </div>
          )}
        </div>

        {/* transition: 변화가 생겼을 때 부드럽게 옮김 */}
        <button className="mt-6 w-full rounded-full bg-white/8 py-3 font-medium text-white transition hover:bg-white/12">
          상품 보기
        </button>
      </div>
    </article>
  );
}