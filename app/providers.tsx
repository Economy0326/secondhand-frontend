"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  // queryClient: Tanstack Query의 중앙 관리자
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 데이터가 신선하다고 간주되는 시간(ms)
            staleTime: 1000 * 30,
            // 브라우저 탭/창에 다시 돌아왔을 때 데이터를 자동으로 다시 가져올지 여부
            refetchOnWindowFocus: false,
            // 실패 시 재시도 1회
            retry: 1,
          },
          // React Query에서 query는 보통 데이터 조회
          // mutation은 데이터 변경(생성, 수정, 삭제)과 관련된 작업을 의미
          mutations: {
            // 실패 시 재시도하지 않음
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발환경에서만 표시 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}