import productsData from "../data/products.json";
import type { Product } from "../types/product";

/**
 * The catalog is bundled static JSON representing Kiln & Leaf roastery products.
 * An asynchronous delay (400–700ms) is simulated deliberately to exercise
 * and showcase loading skeletons, transitions, and error/empty states in the UI.
 */
const products: Product[] = productsData as Product[];

const SIMULATED_DELAY_MS = 500;

function getDemoFlag(): string | null {
  if (typeof window === "undefined") return null;
  const urlSearch = new URLSearchParams(window.location.search).get("demo");
  if (urlSearch) return urlSearch;

  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex !== -1) {
    return new URLSearchParams(hash.slice(queryIndex)).get("demo");
  }
  return null;
}

function simulateNetwork(): Promise<void> {
  const demo = getDemoFlag();
  if (demo === "loading") {
    // Hangs indefinitely to test loading skeleton state
    return new Promise(() => {});
  }
  if (demo === "error") {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Simulated network failure triggered by ?demo=error"));
      }, SIMULATED_DELAY_MS);
    });
  }
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
}

export async function fetchProducts(): Promise<Product[]> {
  await simulateNetwork();
  return [...products];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await simulateNetwork();
  const match = products.find((item) => item.id === id);
  return match ?? null;
}

/**
 * Synchronous lookup used by cart calculations and storage validation.
 */
export function findProduct(id: string): Product | undefined {
  return products.find((item) => item.id === id);
}

export function getAllProducts(): Product[] {
  return [...products];
}
