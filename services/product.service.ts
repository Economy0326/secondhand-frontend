import { apiFetch } from "@/lib/api";
import { CreateProductParams, Product } from "@/types/product";

export function getProducts() {
  return apiFetch<Product[]>("/api/products");
}

export function getProductDetail(productId: number) {
  return apiFetch<Product>(`/api/products/${productId}`);
}

export async function createProduct(payload: CreateProductParams) {
  // FormData(): 파일 업로드를 포함한 폼 데이터를 쉽게 구성할 수 있도록 도와주는 웹 API
  const formData = new FormData();

  payload.images.forEach((image) => {
    formData.append("images", image);
  });

  const params = new URLSearchParams({
    title: payload.title,
    description: payload.description,
    category: payload.category,
    price: String(payload.price),
    isAuction: String(payload.isAuction ?? false),
  });

  if (payload.isAuction) {
    if (!payload.startPrice || !payload.auctionStartTime || !payload.auctionEndTime) {
      throw new Error("경매 상품은 시작가, 시작 시간, 종료 시간이 필요합니다.");
    }

    params.append("startPrice", String(payload.startPrice));
    params.append("auctionStartTime", payload.auctionStartTime);
    params.append("auctionEndTime", payload.auctionEndTime);
  }

  // toString: URLSearchParams 객체를 쿼리 문자열로 변환하는 메서드 (예: "title=상품명&description=설명&...")
  return apiFetch<Product>(`/api/products?${params.toString()}`, {
    method: "POST",
    body: formData,
    auth: true,
  });
}