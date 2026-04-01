import HeroSection from "@/components/home/HeroSection";
import FeaturedAuctionSection from "@/components/home/FeaturedAuctionSection";

export default function HomePage() {
  return (
    <div className="pb-24">
      {/* 메인 히어로 영역 */}
      <HeroSection />

      {/* 대표 경매 상품 목록 */}
      <FeaturedAuctionSection />
    </div>
  );
}