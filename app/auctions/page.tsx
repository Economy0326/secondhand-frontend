import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import AuctionSearchForm from "@/components/auction/AuctionSearchForm";
import ProductListCard from "@/components/product/ProductListCard";
import { getAuctions, searchAuctions } from "@/services/auction.service";
import { AuctionStatus } from "@/types/auction";

type Props = {
  searchParams?: Promise<{
    status?: string;
    keyword?: string;
    category?: string;
  }>;
};

type AuctionStatusFilter = AuctionStatus | "ALL";

const categories = [
  "전자기기",
  "패션",
  "가구",
  "도서",
  "여행 용품",
  "자동차 용품",
  "기타",
];

function isAuctionStatus(value?: string): value is AuctionStatus {
  return (
    value === "READY" ||
    value === "RUNNING" ||
    value === "FINISHED" ||
    value === "FAILED" ||
    value === "CANCELLED"
  );
}

function getFilterClass(isActive: boolean) {
  return isActive
    ? "rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]"
    : "rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5";
}

export default async function AuctionsPage({ searchParams }: Props) {
  const params = await searchParams;

  const status = params?.status;
  const keyword = params?.keyword?.trim();
  const category = params?.category?.trim();

  const activeStatus: AuctionStatusFilter = isAuctionStatus(status)
    ? status
    : "ALL";

  const auctionStatus = isAuctionStatus(status) ? status : undefined;

  // hasSearchCondition: 검색어, 상태, 카테고리 중 하나라도 존재하면 true, 모두 없으면 false. 이를 통해 API 요청 시 검색 조건이 있는지 여부를 판단하여 적절한 함수를 호출할 수 있음 (조건이 있으면 searchAuctions, 없으면 getAuctions)
  const hasSearchCondition = Boolean(keyword || auctionStatus || category);

  const auctions = hasSearchCondition
    ? await searchAuctions({
        keyword,
        status: auctionStatus,
        category,
      })
    : await getAuctions();

  function createAuctionStatusHref(nextStatus?: AuctionStatus) {
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

    return `/auctions${
      nextParams.toString() ? `?${nextParams.toString()}` : ""
    }`;
  }

  // createCategoryHref: 카테고리 필터링 링크를 생성하는 함수. 현재 선택된 경매 상태, 검색어, 그리고 다음에 선택할 카테고리를 기반으로 URLSearchParams를 구성하여 쿼리 문자열을 만들고, 이를 이용해 /auctions 페이지로 이동하는 링크를 반환
  function createCategoryHref(nextCategory?: string) {
    const nextParams = new URLSearchParams();

    if (auctionStatus) {
      nextParams.set("status", auctionStatus);
    }

    if (keyword) {
      nextParams.set("keyword", keyword);
    }

    if (nextCategory) {
      nextParams.set("category", nextCategory);
    }

    return `/auctions${
      nextParams.toString() ? `?${nextParams.toString()}` : ""
    }`;
  }

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Auction House"
          title="경매장"
          description="진행 상태와 카테고리를 기준으로 원하는 경매 상품을 찾아보세요."
        />

        <AuctionSearchForm
          defaultKeyword={keyword}
          status={auctionStatus}
          category={category}
        />
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm text-white/45">경매 상태</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={createAuctionStatusHref()}
            className={getFilterClass(activeStatus === "ALL")}
          >
            전체
          </Link>

          <Link
            href={createAuctionStatusHref("READY")}
            className={getFilterClass(activeStatus === "READY")}
          >
            시작 전
          </Link>

          <Link
            href={createAuctionStatusHref("RUNNING")}
            className={getFilterClass(activeStatus === "RUNNING")}
          >
            진행 중
          </Link>

          <Link
            href={createAuctionStatusHref("FINISHED")}
            className={getFilterClass(activeStatus === "FINISHED")}
          >
            종료
          </Link>

          <Link
            href={createAuctionStatusHref("FAILED")}
            className={getFilterClass(activeStatus === "FAILED")}
          >
            유찰
          </Link>

          <Link
            href={createAuctionStatusHref("CANCELLED")}
            className={getFilterClass(activeStatus === "CANCELLED")}
          >
            취소
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <p className="mb-3 text-sm text-white/45">카테고리</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={createCategoryHref()}
            className={getFilterClass(!category)}
          >
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

      {(keyword || category || auctionStatus) && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
          적용된 조건:
          {keyword && (
            <span className="ml-2 text-white">검색어 "{keyword}"</span>
          )}
          {auctionStatus && (
            <span className="ml-2 text-white">상태 {auctionStatus}</span>
          )}
          {category && (
            <span className="ml-2 text-white">카테고리 {category}</span>
          )}
        </div>
      )}

      {auctions.length === 0 ? (
        <div className="luxury-panel p-10 text-center">
          <p className="text-white/70">조건에 맞는 경매가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {auctions.map((auction) => (
            <ProductListCard
              key={auction.id}
              id={auction.productId}
              title={auction.productTitle}
              description={`${auction.sellerNickname} 판매 상품`}
              isAuction
              currentPrice={auction.currentPrice}
              buyNowPrice={auction.buyNowPrice}
              startPrice={auction.startPrice}
              likes={0}
              status={auction.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}