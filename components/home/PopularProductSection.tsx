import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import { getProducts } from "@/services/product.service";

function getThumbnailUrl(
  images?: { imageUrl: string; isThumbnail: boolean }[]
) {
  if (!images || images.length === 0) return undefined;
  // 썸네일로 지정된 이미지가 있으면 해당 이미지의 URL을 반환하고, 그렇지 않으면 첫 번째 이미지의 URL을 반환
  return images.find((image) => image.isThumbnail)?.imageUrl ?? images[0].imageUrl;
}

export default async function PopularProductSection() {
  const products = await getProducts();

  const popularProducts = products
    // a,b 해당하는 것 : a는 현재 비교 대상인 상품, b는 다음 비교 대상인 상품
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 3);

  return (
    <section className="container-default py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Popular Products"
          title="인기 상품"
          description="사용자들이 가장 많이 찜한 상품을 확인해보세요."
        />

        <Link
          href="/products"
          className="w-fit rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
        >
          전체 상품 보기
        </Link>
      </div>

      {popularProducts.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">아직 등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {popularProducts.map((product) => (
            <ProductListCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              imageUrl={getThumbnailUrl(product.images)}
              isAuction={product.status === "AUCTION"}
              currentPrice={product.currentPrice}
              startPrice={product.startPrice}
              buyNowPrice={product.buyNowPrice}
              likes={product.likeCount}
              status={product.auctionStatus ?? undefined}
              auctionStartTime={product.auctionStartTime}
              auctionEndTime={product.auctionEndTime}
            />
          ))}
        </div>
      )}
    </section>
  );
}