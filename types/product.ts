export type ProductStatus = "SALE" | "AUCTION" | "SOLD";

export interface ProductImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
}

export interface Product {
  id: number;
  sellerId: number;
  sellerNickname: string;
  title: string;
  description: string;
  category: string;

  buyNowPrice: number;
  currentPrice: number;
  startPrice: number | null;

  status: ProductStatus;
  images: ProductImage[];
  createdAt: string;
}

export interface CreateProductParams {
  title: string;
  description: string;
  category: string;

  buyNowPrice: number;
  currentPrice: number;
  startPrice?: number;

  isAuction: boolean;
  auctionStartTime?: string;
  auctionEndTime?: string;

  images: File[];
}