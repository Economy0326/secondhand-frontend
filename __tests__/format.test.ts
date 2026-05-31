// 가격 표시 포맷 테스트

import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("숫자를 원화 형식으로 변환한다", () => {
    expect(formatPrice(50000)).toBe("50,000원");
  });

  it("0원을 원화 형식으로 변환한다", () => {
    expect(formatPrice(0)).toBe("0원");
  });

  it("큰 금액을 쉼표가 포함된 원화 형식으로 변환한다", () => {
    expect(formatPrice(1234567)).toBe("1,234,567원");
  });
});