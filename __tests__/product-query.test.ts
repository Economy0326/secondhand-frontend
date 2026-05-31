// 상품/경매 검색 query 생성 테스트

import { describe, expect, it } from "vitest";
import { buildSearchQuery } from "@/lib/product-query";

describe("buildSearchQuery", () => {
  it("keyword, status, category를 query string으로 변환한다", () => {
    const query = buildSearchQuery({
      keyword: "아이폰",
      status: "RUNNING",
      category: "전자기기",
    });

    expect(query).toContain("keyword=%EC%95%84%EC%9D%B4%ED%8F%B0");
    expect(query).toContain("status=RUNNING");
    expect(query).toContain("category=%EC%A0%84%EC%9E%90%EA%B8%B0%EA%B8%B0");
  });

  it("빈 값은 query string에 포함하지 않는다", () => {
    const query = buildSearchQuery({
      keyword: "",
      status: "RUNNING",
      category: "",
    });

    expect(query).not.toContain("keyword=");
    expect(query).toContain("status=RUNNING");
    expect(query).not.toContain("category=");
  });

  it("모든 값이 없으면 빈 문자열을 반환한다", () => {
    const query = buildSearchQuery({});

    expect(query).toBe("");
  });
});