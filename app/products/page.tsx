import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import { getProducts, getProductsByStatus } from "@/services/product.service";
import { ProductStatus } from "@/types/product";

type Props = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

function getThumbnailUrl(
  images?: { imageUrl: string; isThumbnail: boolean }[]
) {
  if (!images || images.length === 0) return undefined;
  // 썸네일로 지정된 이미지가 있으면 해당 이미지의 URL을 반환하고, 그렇지 않으면 첫 번째 이미지의 URL을 반환
  return images.find((image) => image.isThumbnail)?.imageUrl ?? images[0].imageUrl;
}

function isProductStatus(value?: string): value is ProductStatus {
  return value === "SALE" || value === "AUCTION" || value === "SOLD";
}

function getFilterClass(isActive: boolean) {
  return isActive
    ? "rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]"
    : "rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5";
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params?.status;

  const activeStatus = isProductStatus(status) ? status : "ALL";

  const products = isProductStatus(status)
    ? await getProductsByStatus(status)
    : await getProducts();

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Marketplace"
          title="전체 상품"
          description="일반 판매 상품과 경매 상품을 한눈에 확인해보세요."
        />

        <div className="flex flex-wrap gap-3">
          <Link href="/products" className={getFilterClass(activeStatus === "ALL")}>
            전체
          </Link>

          <Link
            href="/products?status=SALE"
            className={getFilterClass(activeStatus === "SALE")}
          >
            일반 판매
          </Link>

          <Link
            href="/products?status=AUCTION"
            className={getFilterClass(activeStatus === "AUCTION")}
          >
            경매
          </Link>

          <Link
            href="/products?status=SOLD"
            className={getFilterClass(activeStatus === "SOLD")}
          >
            판매 완료
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductListCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              imageUrl={getThumbnailUrl(product.images)}
              isAuction={product.status === "AUCTION"}
              currentPrice={product.currentPrice}
              buyNowPrice={product.buyNowPrice}
              startPrice={product.startPrice}
              likes={0}
            />
          ))}
        </div>
      )}
    </section>
  );
}