import HeroSection from "@/components/home/HeroSection";
import ClosingSoonAuctionSection from "@/components/home/ClosingSoonAuctionSection";
import PopularProductSection from "@/components/home/PopularProductSection";
import AuctionGuideSection from "@/components/home/AuctionGuideSection";

export default function HomePage() {
  return (
    <div className="pb-24">
      {/* 메인 히어로 영역 */}
      <HeroSection />

      {/* 마감 임박 경매 */}
      <ClosingSoonAuctionSection />

      {/* 인기 상품 */}
      <PopularProductSection />

      {/* 경매 이용 방법 안내 */}
      <AuctionGuideSection />
    </div>
  );
}