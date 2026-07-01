import type { AuctionStatus } from "@/types/auction";
import type { ProductImage, ProductStatus } from "@/types/product";

type CanEditProductImagesParams = {
  productStatus: ProductStatus;
  auctionStatus?: AuctionStatus | null;
};

type ValidateProductImagesAfterDeleteParams = {
  existingImages: ProductImage[];
  deleteImageIds: number[];
  newImagesCount: number;
};

type ResolveNextThumbnailParams = {
  existingImages: ProductImage[];
  deleteImageIds: number[];
  thumbnailImageId?: number | null;
  newImagesCount: number;
};

export function canEditProductImages({
  productStatus,
  auctionStatus,
}: CanEditProductImagesParams) {
  if (productStatus === "SALE") {
    return true;
  }

  if (productStatus === "SOLD") {
    return false;
  }

  if (productStatus === "AUCTION") {
    return auctionStatus === "READY";
  }

  return false;
}

export function validateProductImagesAfterDelete({
  existingImages,
  deleteImageIds,
  newImagesCount,
}: ValidateProductImagesAfterDeleteParams) {
  const remainingExistingImages = existingImages.filter(
    (image) => !deleteImageIds.includes(image.id),
  );

  return remainingExistingImages.length + newImagesCount > 0;
}

export function resolveNextThumbnail({
  existingImages,
  deleteImageIds,
  thumbnailImageId,
  newImagesCount,
}: ResolveNextThumbnailParams) {
  const remainingExistingImages = existingImages.filter(
    (image) => !deleteImageIds.includes(image.id),
  );

  if (thumbnailImageId !== undefined && thumbnailImageId !== null) {
    const selectedThumbnail = remainingExistingImages.find(
      (image) => image.id === thumbnailImageId,
    );

    if (selectedThumbnail) {
      return {
        type: "existing" as const,
        imageId: selectedThumbnail.id,
      };
    }
  }

  const currentThumbnail = existingImages.find((image) => image.isThumbnail);
  const isCurrentThumbnailDeleted =
    currentThumbnail !== undefined &&
    deleteImageIds.includes(currentThumbnail.id);

  if (!isCurrentThumbnailDeleted && currentThumbnail) {
    return {
      type: "existing" as const,
      imageId: currentThumbnail.id,
    };
  }

  const fallbackExistingImage = remainingExistingImages[0];

  if (fallbackExistingImage) {
    return {
      type: "existing" as const,
      imageId: fallbackExistingImage.id,
    };
  }

  if (newImagesCount > 0) {
    return {
      type: "new" as const,
      index: 0,
    };
  }

  return null;
}