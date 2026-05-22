import { Product } from "@/types/product";

export interface Like {
  likeId: number;
  productId: number;
  productTitle: string;
  userId: number;
  createdAt: string;
  product?: Product;
}