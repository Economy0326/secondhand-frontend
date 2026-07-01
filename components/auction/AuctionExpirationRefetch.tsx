"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { queryKeys } from "@/lib/query-keys";
import type { AuctionStatus } from "@/types/auction";

type Props = {
  productId?: number;
  auctionId?: number;
  status?: AuctionStatus | null;
  endTime?: string | null;
};

// optimistc update가 아니라 scheduled refetch
// -> 정해진 시간이 되면 자동으로 refetch하도록 구현
export default function AuctionExpirationRefetch({
  productId,
  auctionId,
  status,
  endTime,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasRefetchedRef = useRef(false);

  useEffect(() => {
    if (status !== "RUNNING") return;
    if (!endTime) return;
    if (hasRefetchedRef.current) return;

    const endTimestamp = new Date(endTime).getTime();
    const nowTimestamp = Date.now();
    const delay = endTimestamp - nowTimestamp;

    if (Number.isNaN(endTimestamp)) return;

    async function refetchAuctionData() {
      if (hasRefetchedRef.current) return;

      hasRefetchedRef.current = true;

      // 입찰이 종료되면 경매 관련 데이터를 다시 불러와야 함
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.auctions(),
        }),
        auctionId
          ? queryClient.invalidateQueries({
              queryKey: queryKeys.auction(auctionId),
            })
          : Promise.resolve(),
        productId
          ? queryClient.invalidateQueries({
              queryKey: queryKeys.product(productId),
            })
          : Promise.resolve(),
        productId
          ? queryClient.invalidateQueries({
              queryKey: queryKeys.auctionByProduct(productId),
            })
          : Promise.resolve(),
      ]);

      // 경매 종료 후 서버 컴포넌트 데이터를 다시 불러오기 위해 refresh
      router.refresh();
    }

    // delay: 끝나는시간 - 현재시간
    if (delay <= 0) {
      refetchAuctionData();
      return;
    }

    // 경매 종료까지 남은 시간(ms) + 1초 후에 refetchAuctionData를 호출
    const timerId = window.setTimeout(refetchAuctionData, delay + 1000);

    return () => {
      // 컴포넌트가 언마운트되거나 의존성 배열이 변경될 때 타이머를 정리
      window.clearTimeout(timerId);
    };
  }, [auctionId, endTime, productId, queryClient, router, status]);

  // 화면 렌더링이 없기 때문에 null을 반환
  return null;
}