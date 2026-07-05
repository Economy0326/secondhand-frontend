import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ProductEditPage from "@/app/products/[id]/edit/page";
import type { Auction } from "@/types/auction";
import type { Product } from "@/types/product";

const mocks = vi.hoisted(() => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  },
  params: {
    id: "1",
  },
  getStoredAccessToken: vi.fn(),
  getStoredUser: vi.fn(),
  getProductDetail: vi.fn(),
  updateProduct: vi.fn(),
  getAuctionByProductId: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
  useParams: () => mocks.params,
}));

vi.mock("@/lib/storage", () => ({
  getStoredAccessToken: mocks.getStoredAccessToken,
  getStoredUser: mocks.getStoredUser,
}));

vi.mock("@/services/product.service", () => ({
  getProductDetail: mocks.getProductDetail,
  updateProduct: mocks.updateProduct,
}));

vi.mock("@/services/auction.service", () => ({
  getAuctionByProductId: mocks.getAuctionByProductId,
}));

const baseProduct: Product = {
  id: 1,
  sellerId: 7,
  sellerNickname: "seller",
  title: "테스트 상품",
  description: "테스트 설명",
  category: "디지털기기",
  buyNowPrice: 100000,
  currentPrice: 100000,
  status: "SALE",
  likeCount: 0,
  auctionStartTime: null,
  auctionEndTime: null,
  auctionStatus: null,
  images: [
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
  ],
  createdAt: "2026-01-01T00:00:00",
};

const runningAuction: Auction = {
  id: 10,
  productId: 1,
  productTitle: "테스트 경매",
  sellerNickname: "seller",
  startPrice: 50000,
  currentPrice: 70000,
  buyNowPrice: 120000,
  startTime: "2026-01-01T00:00:00",
  endTime: "2026-01-02T00:00:00",
  status: "RUNNING",
  bidCount: 1,
  likeCount: 0,
  winnerId: null,
  winnerNickname: null,
  createdAt: "2026-01-01T00:00:00",
};

async function renderEditPage({
  product = baseProduct,
  auction = null,
}: {
  product?: Product;
  auction?: Auction | null;
} = {}) {
  mocks.getStoredAccessToken.mockReturnValue("access-token");
  mocks.getStoredUser.mockReturnValue({ userId: 7 });
  mocks.getProductDetail.mockResolvedValue(product);

  if (auction) {
    mocks.getAuctionByProductId.mockResolvedValue(auction);
  } else {
    mocks.getAuctionByProductId.mockRejectedValue(new Error("no auction"));
  }

  const view = render(<ProductEditPage />);

  await screen.findByRole("heading", {
    name: "상품 수정",
  });

  return view;
}

describe("ProductEditPage image interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("기존 이미지를 삭제 예정으로 표시하고 다시 취소할 수 있다", async () => {
    const user = userEvent.setup();

    await renderEditPage();

    const deleteButtons = await screen.findAllByRole("button", {
      name: "삭제 예정",
    });

    await user.click(deleteButtons[0]);

    expect(
      screen.getByRole("button", {
        name: "삭제 취소",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "삭제 취소",
      }),
    );

    expect(
      screen.getAllByRole("button", {
        name: "삭제 예정",
      }).length,
    ).toBeGreaterThan(0);
  });

  it("새 이미지를 추가하면 추가 예정 문구를 보여준다", async () => {
    const user = userEvent.setup();

    const { container } = await renderEditPage();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["image"], "new-image.png", {
      type: "image/png",
    });

    await user.upload(fileInput, file);

    expect(
      screen.getByText("새 이미지 1장이 추가될 예정입니다."),
    ).toBeInTheDocument();
  });

  it("기존 이미지를 썸네일로 선택할 수 있다", async () => {
    const user = userEvent.setup();

    await renderEditPage();

    const thumbnailButton = screen.getByRole("button", {
      name: "썸네일 지정",
    });

    await user.click(thumbnailButton);

    expect(
      screen.getByRole("button", {
        name: "현재 썸네일",
      }),
    ).toBeInTheDocument();
  });

  it("이미지가 0장이 되는 submit은 막는다", async () => {
    const user = userEvent.setup();

    await renderEditPage({
      product: {
        ...baseProduct,
        images: [
          {
            id: 1,
            imageUrl: "/mock/one.jpg",
            isThumbnail: true,
          },
        ],
      },
    });

    await user.click(
      screen.getByRole("button", {
        name: "삭제 예정",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "상품 수정하기",
      }),
    );

    expect(
      await screen.findByText("상품 이미지는 최소 1장 이상 필요합니다."),
    ).toBeInTheDocument();

    expect(mocks.updateProduct).not.toHaveBeenCalled();
  });

  it("RUNNING 경매 상품은 이미지 수정 영역을 노출하지 않는다", async () => {
    await renderEditPage({
      product: {
        ...baseProduct,
        status: "AUCTION",
        auctionStatus: "RUNNING",
      },
      auction: runningAuction,
    });

    expect(
      screen.getByText("진행 중인 경매는 상품명, 설명, 종료 시간만 수정할 수 있습니다."),
    ).toBeInTheDocument();

    expect(screen.queryByText("이미지 수정")).not.toBeInTheDocument();
  });
});