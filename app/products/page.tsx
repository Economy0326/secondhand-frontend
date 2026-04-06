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

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Marketplace"
          title="전체 상품"
          description="일반 거래 상품과 경매 상품을 한눈에 확인해보세요."
        />

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
            전체
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            일반 거래
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            경매
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            최신순
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductListCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            imageUrl={getThumbnailUrl(product.images)}
            isAuction={false}
            price={product.price}
            likes={0}
          />
        ))}
      </div>
    </section>
  );
}