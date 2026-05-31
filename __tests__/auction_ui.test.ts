// 경매 남은 시간 / 상태별 문구 / 가격 라벨 테스트

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  formatRemainingTime,
  getAuctionPriceLabel,
  getAuctionDetailMessage,
  getAuctionTimeText,
} from "@/lib/auction-ui";

describe("formatRemainingTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("targetTime이 없으면 null을 반환한다", () => {
    expect(formatRemainingTime(null)).toBeNull();
    expect(formatRemainingTime(undefined)).toBeNull();
  });

  it("남은 시간이 0 이하이면 종료됨을 반환한다", () => {
    expect(formatRemainingTime("2025-12-31T23:59:00Z")).toBe("종료됨");
  });

  it("하루 이상 남으면 일/시간 단위 문구를 반환한다", () => {
    expect(formatRemainingTime("2026-01-03T02:30:00Z")).toBe("2일 2시간 남음");
  });

  it("하루 미만이면 시간/분 단위 문구를 반환한다", () => {
    expect(formatRemainingTime("2026-01-01T03:20:00Z")).toBe("3시간 20분 남음");
  });

  it("한 시간 미만이면 분 단위 문구를 반환한다", () => {
    expect(formatRemainingTime("2026-01-01T00:30:00Z")).toBe("30분 남음");
  });
});

describe("getAuctionPriceLabel", () => {
  it("FINISHED 상태는 최종 낙찰가를 반환한다", () => {
    expect(getAuctionPriceLabel("FINISHED")).toBe("최종 낙찰가");
  });

  it("FAILED 상태는 최종 가격을 반환한다", () => {
    expect(getAuctionPriceLabel("FAILED")).toBe("최종 가격");
  });

  it("CANCELLED 상태는 취소 전 현재가를 반환한다", () => {
    expect(getAuctionPriceLabel("CANCELLED")).toBe("취소 전 현재가");
  });

  it("READY/RUNNING 또는 상태가 없으면 현재 입찰가를 반환한다", () => {
    expect(getAuctionPriceLabel("READY")).toBe("현재 입찰가");
    expect(getAuctionPriceLabel("RUNNING")).toBe("현재 입찰가");
    expect(getAuctionPriceLabel(null)).toBe("현재 입찰가");
  });
});

describe("getAuctionDetailMessage", () => {
  it("READY 상태 안내 문구를 반환한다", () => {
    expect(getAuctionDetailMessage("READY")).toBe(
      "경매 시작 전입니다. 시작 시간이 되면 입찰할 수 있습니다."
    );
  });

  it("RUNNING 상태 안내 문구를 반환한다", () => {
    expect(getAuctionDetailMessage("RUNNING")).toBe(
      "경매가 진행 중입니다. 현재 입찰가보다 높은 금액으로 입찰할 수 있습니다."
    );
  });

  it("FINISHED 상태 안내 문구를 반환한다", () => {
    expect(getAuctionDetailMessage("FINISHED")).toBe(
      "경매가 종료되었습니다. 최종 낙찰가를 확인할 수 있습니다."
    );
  });

  it("FAILED 상태 안내 문구를 반환한다", () => {
    expect(getAuctionDetailMessage("FAILED")).toBe(
      "입찰 없이 종료되어 유찰된 경매입니다."
    );
  });

  it("CANCELLED 상태 안내 문구를 반환한다", () => {
    expect(getAuctionDetailMessage("CANCELLED")).toBe(
      "판매자에 의해 취소된 경매입니다."
    );
  });
});

describe("getAuctionTimeText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("status가 없으면 null을 반환한다", () => {
    expect(
      getAuctionTimeText({
        status: null,
        startTime: "2026-01-01T01:00:00Z",
        endTime: "2026-01-01T02:00:00Z",
      })
    ).toBeNull();
  });

  it("READY 상태에서 시작 시간이 있으면 시작 예정 문구를 반환한다", () => {
    expect(
      getAuctionTimeText({
        status: "READY",
        startTime: "2026-01-01T01:30:00Z",
      })
    ).toBe("시작 예정 1시간 30분 남음");
  });

  it("RUNNING 상태에서 종료 시간이 있으면 남은 시간 문구를 반환한다", () => {
    expect(
      getAuctionTimeText({
        status: "RUNNING",
        endTime: "2026-01-01T00:45:00Z",
      })
    ).toBe("남은 시간 45분 남음");
  });

  it("FINISHED 상태는 경매 종료를 반환한다", () => {
    expect(getAuctionTimeText({ status: "FINISHED" })).toBe("경매 종료");
  });

  it("FAILED 상태는 유찰을 반환한다", () => {
    expect(getAuctionTimeText({ status: "FAILED" })).toBe("유찰");
  });

  it("CANCELLED 상태는 경매 취소를 반환한다", () => {
    expect(getAuctionTimeText({ status: "CANCELLED" })).toBe("경매 취소");
  });
});