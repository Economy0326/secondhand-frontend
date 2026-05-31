// 입찰 금액 검증 / 입찰 가능 여부 테스트

import { describe, expect, it } from "vitest";
import {
  canBid,
  getBidAmountError,
} from "@/lib/auction-policy";

describe("getBidAmountError", () => {
  it("입찰 금액이 0원이면 에러 메시지를 반환한다", () => {
    expect(
      getBidAmountError({
        bidAmount: 0,
        currentPrice: 50000,
      })
    ).toBe("입찰 금액을 올바르게 입력해주세요.");
  });

  it("입찰 금액이 현재 입찰가보다 낮거나 같으면 에러 메시지를 반환한다", () => {
    expect(
      getBidAmountError({
        bidAmount: 50000,
        currentPrice: 50000,
      })
    ).toBe("현재 입찰가 50,000원보다 높은 금액을 입력해주세요.");
  });

  it("입찰 금액이 즉시 구매가보다 크면 에러 메시지를 반환한다", () => {
    expect(
      getBidAmountError({
        bidAmount: 110000,
        currentPrice: 50000,
        buyNowPrice: 100000,
      })
    ).toBe("입찰 금액은 즉시 구매가 100,000원을 초과할 수 없습니다.");
  });

  it("정상 입찰 금액이면 null을 반환한다", () => {
    expect(
      getBidAmountError({
        bidAmount: 60000,
        currentPrice: 50000,
        buyNowPrice: 100000,
      })
    ).toBeNull();
  });
});

describe("canBid", () => {
  it("로그인 사용자이고 RUNNING 상태이며 현재가보다 높은 금액이면 입찰 가능하다", () => {
    expect(
      canBid({
        status: "RUNNING",
        currentPrice: 50000,
        bidAmount: 60000,
        isLoggedIn: true,
        isSeller: false,
      })
    ).toBe(true);
  });

  it("비로그인 사용자는 입찰할 수 없다", () => {
    expect(
      canBid({
        status: "RUNNING",
        currentPrice: 50000,
        bidAmount: 60000,
        isLoggedIn: false,
        isSeller: false,
      })
    ).toBe(false);
  });

  it("판매자 본인은 자신의 상품에 입찰할 수 없다", () => {
    expect(
      canBid({
        status: "RUNNING",
        currentPrice: 50000,
        bidAmount: 60000,
        isLoggedIn: true,
        isSeller: true,
      })
    ).toBe(false);
  });

  it("READY 상태에서는 입찰할 수 없다", () => {
    expect(
      canBid({
        status: "READY",
        currentPrice: 50000,
        bidAmount: 60000,
        isLoggedIn: true,
        isSeller: false,
      })
    ).toBe(false);
  });

  it("FINISHED 상태에서는 입찰할 수 없다", () => {
    expect(
      canBid({
        status: "FINISHED",
        currentPrice: 50000,
        bidAmount: 60000,
        isLoggedIn: true,
        isSeller: false,
      })
    ).toBe(false);
  });

  it("현재 입찰가보다 낮거나 같은 금액은 입찰할 수 없다", () => {
    expect(
      canBid({
        status: "RUNNING",
        currentPrice: 50000,
        bidAmount: 50000,
        isLoggedIn: true,
        isSeller: false,
      })
    ).toBe(false);
  });
});