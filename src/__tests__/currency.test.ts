import { describe, it, expect } from "vitest";
import {
  formatINR,
  toMinor,
  fromMinor,
  formatMinor,
} from "../lib/currency";

describe("currency utilities", () => {
  describe("formatINR", () => {
    it("groups lakhs correctly using Indian numbering system (e.g. 1,25,000)", () => {
      const formatted = formatINR(125000).replace(/\u00A0/g, " ");
      expect(formatted).toContain("1,25,000");
    });

    it("formats integer amounts without decimals", () => {
      const formatted = formatINR(599).replace(/\u00A0/g, " ");
      expect(formatted).toContain("599");
      expect(formatted).not.toContain(".00");
    });

    it("formats amounts with fractional paise with 2 decimal places", () => {
      const formatted = formatINR(599.5).replace(/\u00A0/g, " ");
      expect(formatted).toContain("599.50");
    });
  });

  describe("toMinor & fromMinor", () => {
    it("converts major units (rupees) to minor units (paise) with round protection", () => {
      expect(toMinor(599)).toBe(59900);
      expect(toMinor(1250.5)).toBe(125050);
      // Floating-point math guard (e.g. 0.1 + 0.2 precision)
      expect(toMinor(19.99)).toBe(1999);
    });

    it("converts minor units (paise) back to major units (rupees)", () => {
      expect(fromMinor(59900)).toBe(599);
      expect(fromMinor(125050)).toBe(1250.5);
    });

    it("formats minor units directly into formatted INR strings", () => {
      const formatted = formatMinor(12500000).replace(/\u00A0/g, " ");
      expect(formatted).toContain("1,25,000");
    });
  });
});
