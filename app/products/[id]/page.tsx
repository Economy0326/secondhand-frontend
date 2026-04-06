import StatusBadge from "@/components/common/StatusBadge";
import { formatPrice } from "@/lib/format";
import { getAuctionByProductId } from "@/services/auction.service";
import { getProductDetail } from "@/services/product.service";

type Props = {
  // Promise: getStaticProps나 getServerSideProps에서 반환된 props는 Promise로 감싸져 있기 때문에, params도 Promise로 감싸져 있다고 가정
  // id가 string인 이유: URL에서 id는 문자열로 전달되기 때문 (예: /products/123에서 id는 "123"이라는 문자열로 전달됨)
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  const product = await getProductDetail(productId);

  let auction = null;
  try {
    auction = await getAuctionByProductId(productId);
  } catch {
    auction = null;
  }

  // isAuction 필요한 이유: 경매 상품인지 일반 거래 상품인지 구분하기 위해 필요
  const isAuction = !!auction;
  const thumbnail =
    product.images.find((image) => image.isThumbnail)?.imageUrl ??
    product.images[0]?.imageUrl;

  return (
    <section className="container-default py-12 md:py-16">
      {/* 1.1fr_0.9fr : 1.1fr은 첫 번째 열의 너비를 나타내고, 0.9fr은 두 번째 열의 너비를 나타냄 */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="luxury-panel overflow-hidden p-4">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={product.title}
                className="aspect-[4/3] w-full rounded-[24px] object-cover"
              />
            ) : (
              <div className="aspect-[4/3] rounded-[24px] bg-[linear-gradient(135deg,#2b3348,#171b26)]" />
            )}
          </div>

          {/* 추가 이미지가 있는 경우, 첫 번째 이미지는 이미 썸네일로 사용했기 때문에 나머지 이미지들을 렌더링 */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="luxury-panel aspect-square rounded-[20px] p-2"
              >
                <img
                  src={image.imageUrl}
                  alt={product.title}
                  className="h-full w-full rounded-[14px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="luxury-panel p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              {isAuction && auction ? (
                <StatusBadge status={auction.status} />
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  일반 거래
                </span>
              )}
              <span className="text-sm text-white/50">판매자 {product.sellerNickname}</span>
            </div>

            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/65">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4">
              {isAuction && auction ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs text-white/45">현재 입찰가</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatPrice(auction.currentPrice)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs text-white/45">시작 입찰가</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--accent)]">
                      {formatPrice(auction.startPrice)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-white/45">판매가</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>
              )}
            </div>

            {isAuction && auction && (
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/65">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/45">입찰 수</p>
                  <p className="mt-2 text-white">{auction.bidCount}회</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/45">경매 종료</p>
                  <p className="mt-2 text-white">
                    {new Date(auction.endTime).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {isAuction ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-[#0f1420] p-4">
                    <label className="mb-2 block text-sm text-white/70">
                      입찰 금액 입력
                    </label>
                    <input
                      type="number"
                      placeholder="현재 입찰가보다 높은 금액을 입력하세요"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                    />
                  </div>

                  <button className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90">
                    입찰하기
                  </button>
                </>
              ) : (
                <button className="w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90">
                  구매하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}