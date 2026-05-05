import { apiFetch } from "@/lib/api";
import { Like } from "@/types/like";

export function likeProduct(productId: number) {
  return apiFetch<Like>(`/api/products/${productId}/likes`, {
    method: "POST",
    auth: true,
  });
}

export function unlikeProduct(productId: number) {
  return apiFetch<void>(`/api/products/${productId}/likes`, {
    method: "DELETE",
    auth: true,
  });
}

export function getMyLikes() {
  return apiFetch<Like[]>("/api/likes/me", {
    auth: true,
  });
}

export function getProductLikeCount(productId: number) {
  return apiFetch<number | Record<string, number>>(
    `/api/products/${productId}/likes/count`
  );
}

export function getIsProductLiked(productId: number) {
  return apiFetch<boolean | Record<string, boolean>>(
    `/api/likes/product/${productId}/me`,
    {
      auth: true,
    }
  );
}