import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LikeButton from "@/components/product/LikeButton";
import {
  getIsProductLiked,
  getProductLikeCount,
  likeProduct,
  unlikeProduct,
} from "@/services/like.service";
import type { Like } from "@/types/like";

vi.mock("@/services/like.service", () => ({
  getIsProductLiked: vi.fn(),
  getProductLikeCount: vi.fn(),
  likeProduct: vi.fn(),
  unlikeProduct: vi.fn(),
  getMyLikes: vi.fn(),
}));

const mockLike: Like = {
  likeId: 1,
  productId: 1,
  productTitle: "테스트 상품",
  userId: 1,
  createdAt: "2026-01-01T00:00:00",
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

describe("LikeButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("찜 처리 중에는 버튼을 disabled 처리한다", async () => {
    const user = userEvent.setup();
    const deferred = createDeferred<Like>();

    vi.mocked(getProductLikeCount).mockResolvedValue(0);
    vi.mocked(getIsProductLiked).mockResolvedValue(false);
    vi.mocked(likeProduct).mockReturnValue(deferred.promise);

    renderWithQueryClient(<LikeButton productId={1} />);

    const button = await screen.findByRole("button", {
      name: /찜하기/,
    });

    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    expect(screen.getByRole("button")).toHaveTextContent("처리 중");

    deferred.resolve(mockLike);
  });

  it("찜 성공 시 UI를 반영한다", async () => {
    const user = userEvent.setup();

    vi.mocked(getProductLikeCount)
      .mockResolvedValueOnce(0)
      .mockResolvedValue(1);

    vi.mocked(getIsProductLiked)
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);

    vi.mocked(likeProduct).mockResolvedValue(mockLike);

    renderWithQueryClient(<LikeButton productId={1} />);

    const button = await screen.findByRole("button", {
      name: /찜하기/,
    });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("찜 취소");
      expect(screen.getByRole("button")).toHaveTextContent("1");
    });

    expect(likeProduct).toHaveBeenCalledWith(1);
  });

  it("찜 실패 시 이전 상태를 유지하고 에러 메시지를 보여준다", async () => {
    const user = userEvent.setup();

    vi.mocked(getProductLikeCount).mockResolvedValue(0);
    vi.mocked(getIsProductLiked).mockResolvedValue(false);
    vi.mocked(likeProduct).mockRejectedValue(new Error("찜 처리 실패"));

    renderWithQueryClient(<LikeButton productId={1} />);

    const button = await screen.findByRole("button", {
      name: /찜하기/,
    });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("찜하기");
      expect(screen.getByRole("button")).toHaveTextContent("0");
    });

    expect(screen.getByText("찜 처리 실패")).toBeInTheDocument();
  });

  it("이미 찜한 상품을 클릭하면 찜 취소 요청을 보낸다", async () => {
    const user = userEvent.setup();

    vi.mocked(getProductLikeCount)
      .mockResolvedValueOnce(1)
      .mockResolvedValue(0);

    vi.mocked(getIsProductLiked)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);

    vi.mocked(unlikeProduct).mockResolvedValue(undefined);

    renderWithQueryClient(<LikeButton productId={1} />);

    const button = await screen.findByRole("button", {
      name: /찜 취소/,
    });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("찜하기");
      expect(screen.getByRole("button")).toHaveTextContent("0");
    });

    expect(unlikeProduct).toHaveBeenCalledWith(1);
  });
});