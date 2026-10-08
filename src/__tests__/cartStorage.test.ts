import { describe, it, expect } from "vitest";
import { parseStoredCart } from "../context/cartStorage";

describe("parseStoredCart", () => {
  it("returns an empty array when given null", () => {
    expect(parseStoredCart(null)).toEqual([]);
  });

  it("returns an empty array when given invalid JSON", () => {
    expect(parseStoredCart("{invalid:json")).toEqual([]);
  });

  it("returns an empty array when given a non-array JSON object", () => {
    expect(parseStoredCart("{}")).toEqual([]);
  });

  it("returns an empty array when given a JSON primitive string", () => {
    expect(parseStoredCart('"x"')).toEqual([]);
  });

  it("filters out unknown product IDs not in the catalog", () => {
    const raw = JSON.stringify([
      { id: "unknown-mystery-coffee-id-404", qty: 2 },
      { id: "chikmagalur-estate", qty: 1 },
    ]);
    expect(parseStoredCart(raw)).toEqual([
      { id: "chikmagalur-estate", qty: 1 },
    ]);
  });

  it("handles non-finite, negative, oversized, and fractional quantities", () => {
    const raw = JSON.stringify([
      { id: "chikmagalur-estate", qty: -5 }, // negative: filtered out
      { id: "monsooned-malabar", qty: NaN }, // NaN: filtered out
      { id: "araku-valley", qty: 999 }, // 999: clamped to MAX_CART_QTY (20)
      { id: "darjeeling-first-flush", qty: 1.5 }, // 1.5: floored to 1
    ]);

    expect(parseStoredCart(raw)).toEqual([
      { id: "araku-valley", qty: 20 },
      { id: "darjeeling-first-flush", qty: 1 },
    ]);
  });

  it("deduplicates multiple entries with the same product ID", () => {
    const raw = JSON.stringify([
      { id: "chikmagalur-estate", qty: 2 },
      { id: "chikmagalur-estate", qty: 4 },
    ]);

    expect(parseStoredCart(raw)).toEqual([
      { id: "chikmagalur-estate", qty: 2 },
    ]);
  });

  it("successfully parses a valid stored cart array", () => {
    const valid = [
      { id: "chikmagalur-estate", qty: 2 },
      { id: "monsooned-malabar", qty: 3 },
    ];
    const raw = JSON.stringify(valid);

    expect(parseStoredCart(raw)).toEqual(valid);
  });
});
