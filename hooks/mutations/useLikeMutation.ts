import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { likeProduct, unlikeProduct } from "@/services/like.service";

// UseLikeMutation: 상품 좋아요/좋아요 취소 Mutation 훅
type UseLikeMutationParams = {
  productId: number;
};

// ToggleLikeVariables: 좋아요 상태 토글 시 필요한 변수 타입
type ToggleLikeVariables = {
  nextLiked: boolean;
  previousLiked: boolean;
  previousCount: number;
};

export function useLikeMutation({ productId }: UseLikeMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    // 실제 서버 요청
    mutationFn: async ({ nextLiked }: ToggleLikeVariables) => {
      if (nextLiked) {
        return likeProduct(productId);
      }

      return unlikeProduct(productId);
    },

    // onMutate: Mutation이 시작될 때 호출되는 함수
    // 서버 응답을 기다리지 않고 UI를 즉시 업데이트하여 사용자 경험을 향상시키는 Optimistic Update를 수행
    onMutate: async (variables) => {
      // 충돌 방지를 위해 관련 쿼리들을 취소하고, 이전 상태를 저장한 후, UI를 즉시 업데이트
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.productLikeStatus(productId),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.productLikeCount(productId),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.myLikes,
        }),
      ]);

      const previousLiked = queryClient.getQueryData<boolean>(
        queryKeys.productLikeStatus(productId),
      );

      const previousCount = queryClient.getQueryData<number>(
        queryKeys.productLikeCount(productId),
      );

      // set: 쿼리 캐시를 업데이트하여 찜 상태를 먼저 바꿈
      queryClient.setQueryData(
        queryKeys.productLikeStatus(productId),
        variables.nextLiked,
      );

      queryClient.setQueryData(
        queryKeys.productLikeCount(productId),
        variables.nextLiked
          ? Math.max(variables.previousCount + 1, 0)
          : Math.max(variables.previousCount - 1, 0),
      );

      return {
        previousLiked,
        previousCount,
      };
    },

    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        queryKeys.productLikeStatus(productId),
        // variables: mutate() 호출할 때 넘긴 값, context: onMutate에서 return한 값
        context?.previousLiked ?? variables.previousLiked,
      );

      queryClient.setQueryData(
        queryKeys.productLikeCount(productId),
        context?.previousCount ?? variables.previousCount,
      );
    },

    // onSettled: Mutation이 완료된 후 호출되는 함수, 쿼리 무효화 수행
    // 성공/실패 여부와 상관없이 항상 호출되며, 서버와 클라이언트의 데이터 동기화를 위해 관련 쿼리를 무효화
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.products(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.product(productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.myLikes,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productLikeStatus(productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productLikeCount(productId),
        }),
      ]);
    },
  });
}