export const queryKeys = {
  me: ["me"] as const,

  products: (params?: unknown) =>
    params === undefined ? (["products"] as const) : (["products", params] as const),

  product: (productId: number) => ["product", productId] as const,

  myProducts: ["my-products"] as const,

  auctions: (params?: unknown) =>
    params === undefined ? (["auctions"] as const) : (["auctions", params] as const),

  auction: (auctionId: number) => ["auction", auctionId] as const,

  auctionByProduct: (productId: number) =>
    ["auction", "product", productId] as const,

  myLikes: ["my-likes"] as const,

  productLikeStatus: (productId: number) =>
    ["product", productId, "like-status"] as const,

  productLikeCount: (productId: number) =>
    ["product", productId, "like-count"] as const,

  myBids: ["my-bids"] as const,

  bidsByAuction: (auctionId: number) =>
    ["auction", auctionId, "bids"] as const,

  highestBid: (auctionId: number) =>
    ["auction", auctionId, "highest-bid"] as const,

  myQnas: ["my-qnas"] as const,
};