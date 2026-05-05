import { apiFetch } from "@/lib/api";
import {
  CreateProductParams,
  Product,
  ProductStatus,
  UpdateProductParams,
} from "@/types/product";

export function getProducts() {
  return apiFetch<Product[]>("/api/products");
}

export function getProductsByStatus(status: ProductStatus) {
  return apiFetch<Product[]>(`/api/products/status/${status}`);
}

// 검색 + 상태 + 카테고리 통합 
export function searchProducts(params: {
  keyword?: string;
  status?: ProductStatus;
  category?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.append("keyword", params.keyword);
  }

  if (params.status) {
    searchParams.append("status", params.status);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  const queryString = searchParams.toString();

  return apiFetch<Product[]>(
    `/api/products/search${queryString ? `?${queryString}` : ""}`
  );
}

export function getProductDetail(productId: number) {
  return apiFetch<Product>(`/api/products/${productId}`);
}

export function deleteProduct(productId: number) {
  return apiFetch<void>(`/api/products/${productId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function updateProduct(productId: number, payload: UpdateProductParams) {
  return apiFetch<Product>(`/api/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function getMyProducts() {
  return apiFetch<Product[]>("/api/products/me", {
    auth: true,
  });
}

// 상품 등록은 스웨거 상 쿼리 + multipart/form-data로 되어있어서, URLSearchParams와 FormData를 함께 사용하여 요청을 구성해야 함
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
    buyNowPrice: String(payload.buyNowPrice),
    currentPrice: String(payload.currentPrice),
    isAuction: String(payload.isAuction),
  });

  if (payload.isAuction) {
    if (
      payload.startPrice === undefined ||
      !payload.auctionStartTime ||
      !payload.auctionEndTime
    ) {
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
    // auth: true -> 상품 등록 API는 인증이 필요한 API이기 때문에, apiFetch 함수에서 auth 옵션을 true로 설정하여 요청 헤더에 인증 토큰이 포함되도록 함
    auth: true,
  });
}