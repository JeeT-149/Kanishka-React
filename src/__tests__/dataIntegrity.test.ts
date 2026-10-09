import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import productsData from "../data/products.json";
import reviewsData from "../data/reviews.json";
import type { Product } from "../types/product";
import type { Review } from "../types/review";

const products = productsData as Product[];
const reviews = reviewsData as Review[];

describe("Data Integrity", () => {
  it("has unique product ids for all items", () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(products.length);
  });

  it("verifies that every image and gallery file exists on disk", () => {
    products.forEach((product) => {
      const allImages = Array.from(
        new Set([product.image, ...(product.images || [])]),
      );

      allImages.forEach((imgRelPath) => {
        const cleanPath = imgRelPath.replace(/^\//, "");
        const absPath = path.resolve(process.cwd(), "public", cleanPath);
        expect(
          fs.existsSync(absPath),
          `Image ${imgRelPath} for product ${product.id} does not exist on disk at ${absPath}`,
        ).toBe(true);
      });
    });
  });

  it("has positive integer prices for all products", () => {
    products.forEach((product) => {
      expect(Number.isInteger(product.price)).toBe(true);
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it("has valid ratings between 0 and 5 for all products", () => {
    products.forEach((product) => {
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    });
  });

  it("has about story, at least 3 details, and non-empty box for every product", () => {
    products.forEach((product) => {
      expect(typeof product.about).toBe("string");
      expect(product.about.trim().length).toBeGreaterThan(20);

      expect(Array.isArray(product.details)).toBe(true);
      expect(
        product.details.length,
        `Product ${product.id} must have at least 3 details rows`,
      ).toBeGreaterThanOrEqual(3);

      product.details.forEach((detail) => {
        expect(detail.label.trim().length).toBeGreaterThan(0);
        expect(detail.value.trim().length).toBeGreaterThan(0);
      });

      expect(Array.isArray(product.box)).toBe(true);
      expect(
        product.box.length,
        `Product ${product.id} must have a non-empty box array`,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("ensures consumables have allergens and gear has materials", () => {
    products.forEach((product) => {
      if (product.category === "gear") {
        expect(
          Array.isArray(product.materials),
          `Gear product ${product.id} must have a materials array`,
        ).toBe(true);
        expect(product.materials?.length).toBeGreaterThanOrEqual(1);
      } else {
        expect(
          product.allergens,
          `Consumable product ${product.id} (${product.category}) must have allergens defined`,
        ).toBeDefined();
        expect(Array.isArray(product.allergens?.contains)).toBe(true);
        expect(Array.isArray(product.allergens?.mayContain)).toBe(true);
      }
    });
  });

  it("ensures each product has 2-3 reviews with valid ratings and data", () => {
    const productIds = new Set(products.map((p) => p.id));
    const reviewIds = new Set<string>();

    // Test unique review ids
    reviews.forEach((review) => {
      expect(
        reviewIds.has(review.id),
        `Duplicate review id found: ${review.id}`,
      ).toBe(false);
      reviewIds.add(review.id);

      // Integer rating 1-5
      expect(Number.isInteger(review.rating)).toBe(true);
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);

      // Valid productId
      expect(
        productIds.has(review.productId),
        `Review ${review.id} has invalid productId: ${review.productId}`,
      ).toBe(true);

      // Author and non-empty content
      expect(review.author.trim().length).toBeGreaterThan(0);
      expect(review.title.trim().length).toBeGreaterThan(0);
      expect(review.body.trim().length).toBeGreaterThan(0);

      // Date is in 2026 before today (2026-10-09)
      expect(review.date.startsWith("2026-")).toBe(true);
      expect(new Date(review.date).getTime()).toBeLessThan(
        new Date("2026-10-10").getTime(),
      );
    });

    // Test 2-3 reviews per product
    products.forEach((product) => {
      const productReviews = reviews.filter((r) => r.productId === product.id);
      expect(
        productReviews.length,
        `Product ${product.id} must have 2-3 reviews, found ${productReviews.length}`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        productReviews.length,
        `Product ${product.id} must have 2-3 reviews, found ${productReviews.length}`,
      ).toBeLessThanOrEqual(3);
    });
  });
});
