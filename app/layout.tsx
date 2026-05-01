import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

// 사이트 기본 메타 정보
// export: Next.js에서 이 metadata를 읽어서 문서 메타 정보를 자동 생성
export const metadata: Metadata = {
  title: "SecondHand Auction",
  description: "중고거래와 경매를 함께 제공하는 프리미엄 플랫폼",
};

// RootLayout: 앱 전체를 감싸는 최상위 레이아웃 컴포넌트
export default function RootLayout({
  children,
  // Readonly: 읽기 전용 타입으로, 수정 불가능
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* 공통 헤더 */}
        <Header />

        {/* 레이아웃 페이지는 import 안해도 자동 연결*/}
        {/* 각 페이지 본문 */}
        <main>{children}</main>
      </body>
    </html>
  );
}