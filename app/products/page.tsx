import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import ProductListCard from "@/components/product/ProductListCard";
import ProductSearchForm from "@/components/product/ProductSearchForm";
import { getProducts, searchProducts } from "@/services/product.service";
import { ProductStatus } from "@/types/product";

type Props = {
  searchParams?: Promise<{
    status?: string;
    keyword?: string;
    category?: string;
  }>;
};

// 상품 검색 페이지에서는 검색어, 상태, 카테고리 세 가지 조건을 모두 지원해야 하므로, URLSearchParams를 활용하여 쿼리 문자열을 구성하고 이를 기반으로 API 요청을 보내는 방식으로 구현
const categories = [
  "전자기기",
  "패션",
  "가구",
  "도서",
  "여행 용품",
  "자동차 용품",
  "기타",
];

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
  const keyword = params?.keyword?.trim();
  const category = params?.category?.trim();

  const activeStatus = isProductStatus(status) ? status : "ALL";
  const productStatus = isProductStatus(status) ? status : undefined;

  const hasSearchCondition = Boolean(keyword || productStatus || category);

  const products = hasSearchCondition
    ? await searchProducts({
        keyword,
        status: productStatus,
        category,
      })
    : await getProducts();

  function createProductsHref(nextStatus?: ProductStatus) {
    const nextParams = new URLSearchParams();

    if (nextStatus) {
      nextParams.set("status", nextStatus);
    }

    if (keyword) {
      nextParams.set("keyword", keyword);
    }

    if (category) {
      nextParams.set("category", category);
    }

    return `/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`;
  }

  function createCategoryHref(nextCategory?: string) {
    const nextParams = new URLSearchParams();

    if (productStatus) {
      nextParams.set("status", productStatus);
    }

    if (keyword) {
      nextParams.set("keyword", keyword);
    }

    if (nextCategory) {
      nextParams.set("category", nextCategory);
    }

    return `/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`;
  }

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Marketplace"
          title="전체 상품"
          description="일반 판매 상품과 경매 상품을 검색하고 필터링해서 확인해보세요."
        />

        <ProductSearchForm
          defaultKeyword={keyword}
          status={productStatus}
          category={category}
        />
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm text-white/45">상품 상태</p>
        <div className="flex flex-wrap gap-3">
          <Link href={createProductsHref()} className={getFilterClass(activeStatus === "ALL")}>
            전체
          </Link>

          <Link
            href={createProductsHref("SALE")}
            className={getFilterClass(activeStatus === "SALE")}
          >
            일반 판매
          </Link>

          <Link
            href={createProductsHref("AUCTION")}
            className={getFilterClass(activeStatus === "AUCTION")}
          >
            경매
          </Link>

          <Link
            href={createProductsHref("SOLD")}
            className={getFilterClass(activeStatus === "SOLD")}
          >
            판매 완료
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <p className="mb-3 text-sm text-white/45">카테고리</p>
        <div className="flex flex-wrap gap-3">
          <Link href={createCategoryHref()} className={getFilterClass(!category)}>
            전체 카테고리
          </Link>

          {categories.map((item) => (
            <Link
              key={item}
              href={createCategoryHref(item)}
              className={getFilterClass(category === item)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {(keyword || category || productStatus) && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
          적용된 조건:
          {keyword && <span className="ml-2 text-white">검색어 "{keyword}"</span>}
          {productStatus && <span className="ml-2 text-white">상태 {productStatus}</span>}
          {category && <span className="ml-2 text-white">카테고리 {category}</span>}
        </div>
      )}

      {products.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">조건에 맞는 상품이 없습니다.</p>
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