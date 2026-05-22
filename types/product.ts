import { AuctionStatus } from "@/types/auction";

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

  startPrice?: number | null;
  buyNowPrice: number;
  currentPrice: number;

  status: ProductStatus;
  likeCount: number;

  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
  auctionStatus?: AuctionStatus | null;

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

export interface UpdateProductParams {
  title?: string;
  description?: string;
  category?: string;

  buyNowPrice?: number;
  startPrice?: number;
  auctionStartTime?: string;
  auctionEndTime?: string;

  images?: File[];
}