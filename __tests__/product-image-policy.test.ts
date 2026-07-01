import { describe, expect, it } from "vitest";

import {
  canEditProductImages,
  resolveNextThumbnail,
  validateProductImagesAfterDelete,
} from "@/lib/product-image-policy";
import type { ProductImage } from "@/types/product";

const images: ProductImage[] = [
  {
    id: 1,
    imageUrl: "/mock/one.jpg",
    isThumbnail: true,
  },
  {
    id: 2,
    imageUrl: "/mock/two.jpg",
    isThumbnail: false,
  },
];

describe("canEditProductImages", () => {
  it("SALE 상품은 이미지 수정이 가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "SALE",
      }),
    ).toBe(true);
  });

  it("SOLD 상품은 이미지 수정이 불가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "SOLD",
      }),
    ).toBe(false);
  });

  it("READY 상태의 경매 상품은 이미지 수정이 가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "AUCTION",
        auctionStatus: "READY",
      }),
    ).toBe(true);
  });

  it("RUNNING 상태의 경매 상품은 이미지 수정이 불가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "AUCTION",
        auctionStatus: "RUNNING",
      }),
    ).toBe(false);
  });

  it("FINISHED 상태의 경매 상품은 이미지 수정이 불가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "AUCTION",
        auctionStatus: "FINISHED",
      }),
    ).toBe(false);
  });

  it("FAILED 상태의 경매 상품은 이미지 수정이 불가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "AUCTION",
        auctionStatus: "FAILED",
      }),
    ).toBe(false);
  });

  it("CANCELLED 상태의 경매 상품은 이미지 수정이 불가능하다", () => {
    expect(
      canEditProductImages({
        productStatus: "AUCTION",
        auctionStatus: "CANCELLED",
      }),
    ).toBe(false);
  });
});

describe("validateProductImagesAfterDelete", () => {
  it("삭제 후 기존 이미지와 새 이미지가 모두 없으면 false를 반환한다", () => {
    expect(
      validateProductImagesAfterDelete({
        existingImages: images,
        deleteImageIds: [1, 2],
        newImagesCount: 0,
      }),
    ).toBe(false);
  });

  it("기존 이미지를 모두 삭제해도 새 이미지가 있으면 true를 반환한다", () => {
    expect(
      validateProductImagesAfterDelete({
        existingImages: images,
        deleteImageIds: [1, 2],
        newImagesCount: 1,
      }),
    ).toBe(true);
  });

  it("삭제 후 남은 기존 이미지가 있으면 true를 반환한다", () => {
    expect(
      validateProductImagesAfterDelete({
        existingImages: images,
        deleteImageIds: [1],
        newImagesCount: 0,
      }),
    ).toBe(true);
  });
});

describe("resolveNextThumbnail", () => {
  it("thumbnailImageId가 있으면 해당 기존 이미지를 썸네일로 반환한다", () => {
    expect(
      resolveNextThumbnail({
        existingImages: images,
        deleteImageIds: [],
        thumbnailImageId: 2,
        newImagesCount: 0,
      }),
    ).toEqual({
      type: "existing",
      imageId: 2,
    });
  });

  it("기존 썸네일이 삭제되지 않으면 기존 썸네일을 유지한다", () => {
    expect(
      resolveNextThumbnail({
        existingImages: images,
        deleteImageIds: [],
        thumbnailImageId: null,
        newImagesCount: 0,
      }),
    ).toEqual({
      type: "existing",
      imageId: 1,
    });
  });

  it("기존 썸네일이 삭제되면 남은 기존 이미지 중 첫 번째 이미지를 썸네일로 반환한다", () => {
    expect(
      resolveNextThumbnail({
        existingImages: images,
        deleteImageIds: [1],
        thumbnailImageId: null,
        newImagesCount: 0,
      }),
    ).toEqual({
      type: "existing",
      imageId: 2,
    });
  });

  it("기존 이미지가 모두 삭제되고 새 이미지가 있으면 새 이미지 첫 번째를 썸네일로 반환한다", () => {
    expect(
      resolveNextThumbnail({
        existingImages: images,
        deleteImageIds: [1, 2],
        thumbnailImageId: null,
        newImagesCount: 2,
      }),
    ).toEqual({
      type: "new",
      index: 0,
    });
  });

  it("남은 이미지와 새 이미지가 모두 없으면 null을 반환한다", () => {
    expect(
      resolveNextThumbnail({
        existingImages: images,
        deleteImageIds: [1, 2],
        thumbnailImageId: null,
        newImagesCount: 0,
      }),
    ).toBeNull();
  });
});