import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { createBid } from "@/services/bid.service";

type UseBidMutationParams = {
  auctionId: number;
  productId?: number;
};

type CreateBidVariables = {
  bidPrice: number;
};

export function useBidMutation({
  auctionId,
  productId,
}: UseBidMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    // 실제 서버 요청
    mutationFn: (variables: CreateBidVariables) => {
      return createBid(auctionId, {
        bidPrice: variables.bidPrice,
      });
    },

    // 성공 시 캐시 무효화
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.auctions(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.auction(auctionId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.bidsByAuction(auctionId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.highestBid(auctionId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.myBids,
        }),
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
    },
  });
}