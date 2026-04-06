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
  price: number;
  status: string;
  images: ProductImage[];
  createdAt: string;
}

export interface CreateProductParams {
  title: string;
  description: string;
  category: string;
  price: number;
  isAuction?: boolean;
  startPrice?: number;
  auctionStartTime?: string;
  auctionEndTime?: string;
  images: File[];
}