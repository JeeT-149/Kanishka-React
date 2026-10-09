import { describe, it, expect } from "vitest";
import {
  filterAndSortProducts,
  normalizeSearchString,
} from "../lib/productFilters";
import type { Product } from "../types/product";

const sampleProducts: Product[] = [
  {
    id: "guatemala-volcan",
    name: "Antigua Volcán de Fuego",
    category: "single",
    price: 750,
    rating: 4.9,
    image: "/images/products/guatemala-volcan.svg",
    images: ["/images/products/guatemala-volcan.svg"],
    origin: "Guatemala Antigua",
    tastingNotes: ["Dark chocolate", "Plum", "Brown sugar"],
    description: "Grown on volcanic slopes.",
    featured: 2,
    about: "Grown in nutrient-dense volcanic soil.",
    details: [{ label: "Altitude", value: "1,500m" }],
    box: ["250g pouch"],
  },
  {
    id: "ethiopia-washed",
    name: "Ethiopia Yirgacheffe G1",
    category: "single",
    price: 680,
    rating: 4.8,
    image: "/images/products/ethiopia-washed.svg",
    images: ["/images/products/ethiopia-washed.svg"],
    origin: "Ethiopia Yirgacheffe",
    tastingNotes: ["Jasmine", "Bergamot", "Peach"],
    description: "A washed process heirloom lot with delicate floral brightness.",
    featured: 1,
    about: "Hand-picked high in the Yirgacheffe highlands.",
    details: [{ label: "Altitude", value: "1,900m" }],
    box: ["250g pouch"],
  },
  {
    id: "house-blend",
    name: "Kiln House Blend",
    category: "blends",
    price: 520,
    rating: 4.7,
    image: "/images/products/house-blend.svg",
    images: ["/images/products/house-blend.svg"],
    tastingNotes: ["Caramel", "Hazelnut"],
    description: "Our signature blend.",
    featured: 3,
    about: "Roasted medium to highlight sweet caramel notes.",
    details: [{ label: "Components", value: "Arabica blend" }],
    box: ["250g pouch"],
  },
  {
    id: "darjeeling-tea",
    name: "Makaibari Darjeeling Silver Needle",
    category: "tea",
    price: 890,
    rating: 4.9,
    image: "/images/products/darjeeling-tea.svg",
    images: ["/images/products/darjeeling-tea.svg"],
    origin: "India Darjeeling",
    tastingNotes: ["Muscatel", "White peach"],
    description: "Rare first harvest white tea.",
    featured: 4,
    about: "Delicate spring harvest from Makaibari estate.",
    details: [{ label: "Harvest", value: "First flush" }],
    box: ["100g tin"],
  },
];

describe("normalizeSearchString", () => {
  it("strips diacritics, lowercases, trims, and collapses multiple spaces", () => {
    expect(normalizeSearchString("  Volcán   de   Fuego  ")).toBe("volcan de fuego");
    expect(normalizeSearchString("Café au Lait")).toBe("cafe au lait");
    expect(normalizeSearchString("SENCHA 綠茶")).toBe("sencha 綠茶");
  });
});

describe("filterAndSortProducts", () => {
  it("filters by category", () => {
    const teaOnly = filterAndSortProducts(sampleProducts, "", "tea", "featured");
    expect(teaOnly).toHaveLength(1);
    expect(teaOnly[0].id).toBe("darjeeling-tea");
  });

  it("matches diacritics insensitively: 'volcan' finds 'Antigua Volcán de Fuego'", () => {
    const results = filterAndSortProducts(sampleProducts, "volcan", "all", "featured");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("guatemala-volcan");
  });

  it("supports multi-word queries where all words must match ('ethiopia washed')", () => {
    const results = filterAndSortProducts(
      sampleProducts,
      "ethiopia washed",
      "all",
      "featured",
    );
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("ethiopia-washed");

    // Partial mismatch where only one word matches should fail
    const mismatch = filterAndSortProducts(
      sampleProducts,
      "ethiopia colombia",
      "all",
      "featured",
    );
    expect(mismatch).toHaveLength(0);
  });

  it("sorts by price: low to high", () => {
    const results = filterAndSortProducts(sampleProducts, "", "all", "price-asc");
    expect(results.map((p) => p.price)).toEqual([520, 680, 750, 890]);
  });

  it("sorts by price: high to low", () => {
    const results = filterAndSortProducts(sampleProducts, "", "all", "price-desc");
    expect(results.map((p) => p.price)).toEqual([890, 750, 680, 520]);
  });

  it("sorts by rating", () => {
    const results = filterAndSortProducts(sampleProducts, "", "all", "rating");
    expect(results[0].rating).toBe(4.9);
    expect(results[results.length - 1].rating).toBe(4.7);
  });

  it("sorts by featured rank by default", () => {
    const results = filterAndSortProducts(sampleProducts, "", "all", "featured");
    expect(results.map((p) => p.id)).toEqual([
      "ethiopia-washed",
      "guatemala-volcan",
      "house-blend",
      "darjeeling-tea",
    ]);
  });

  it("returns an empty array when no products match the query", () => {
    const results = filterAndSortProducts(
      sampleProducts,
      "nonexistent nonexistent roast",
      "all",
      "featured",
    );
    expect(results).toEqual([]);
  });
});
