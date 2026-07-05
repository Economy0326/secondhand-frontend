import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BidForm from "@/components/product/BidForm";

const mocks = vi.hoisted(() => ({
  router: {
    refresh: vi.fn(),
  },
  bidMutation: {
    mutateAsync: vi.fn(),
    isPending: false,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));

vi.mock("@/hooks/mutations/useBidMutation", () => ({
  useBidMutation: () => mocks.bidMutation,
}));

describe("BidForm", () => {
  beforeEach(() => {
    mocks.router.refresh.mockReset();
    mocks.bidMutation.mutateAsync.mockReset();
    mocks.bidMutation.isPending = false;
  });

  afterEach(() => {
    cleanup();
  });

  it("invalid 금액이면 submit을 막고 mutation을 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <BidForm
        auctionId={1}
        productId={10}
        currentPrice={50000}
        buyNowPrice={100000}
      />,
    );

    await user.click(screen.getByRole("button", { name: "입찰하기" }));

    expect(
      await screen.findByText("입찰 금액을 올바르게 입력해주세요."),
    ).toBeInTheDocument();

    expect(mocks.bidMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("현재가보다 낮거나 같은 금액이면 submit을 막는다", async () => {
    const user = userEvent.setup();

    render(
      <BidForm
        auctionId={1}
        productId={10}
        currentPrice={50000}
        buyNowPrice={100000}
      />,
    );

    await user.type(screen.getByRole("spinbutton"), "50000");
    await user.click(screen.getByRole("button", { name: "입찰하기" }));

    expect(
      await screen.findByText(
        "현재 입찰가 50,000원보다 높은 금액을 입력해주세요.",
      ),
    ).toBeInTheDocument();

    expect(mocks.bidMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("즉시 구매가보다 큰 금액이면 submit을 막는다", async () => {
    const user = userEvent.setup();

    render(
      <BidForm
        auctionId={1}
        productId={10}
        currentPrice={50000}
        buyNowPrice={100000}
      />,
    );

    await user.type(screen.getByRole("spinbutton"), "110000");
    await user.click(screen.getByRole("button", { name: "입찰하기" }));

    expect(
      await screen.findByText(
        "입찰 금액은 즉시 구매가 100,000원을 초과할 수 없습니다.",
      ),
    ).toBeInTheDocument();

    expect(mocks.bidMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("정상 금액이면 입찰 mutation을 호출하고 refresh한다", async () => {
    const user = userEvent.setup();

    mocks.bidMutation.mutateAsync.mockResolvedValue({});

    render(
      <BidForm
        auctionId={1}
        productId={10}
        currentPrice={50000}
        buyNowPrice={100000}
      />,
    );

    await user.type(screen.getByRole("spinbutton"), "60000");
    await user.click(screen.getByRole("button", { name: "입찰하기" }));

    await waitFor(() => {
      expect(mocks.bidMutation.mutateAsync).toHaveBeenCalledWith({
        bidPrice: 60000,
      });
    });

    expect(mocks.router.refresh).toHaveBeenCalled();
  });

  it("pending 중에는 input과 button을 disabled 처리한다", () => {
    mocks.bidMutation.isPending = true;

    render(
      <BidForm
        auctionId={1}
        productId={10}
        currentPrice={50000}
        buyNowPrice={100000}
      />,
    );

    expect(screen.getByRole("spinbutton")).toBeDisabled();
    expect(screen.getByRole("button", { name: "입찰 중..." })).toBeDisabled();
  });
});