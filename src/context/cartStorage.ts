import { findProduct } from "../services/productService";

export interface StoredCartLine {
  id: string;
  qty: number;
}

export const CART_STORAGE_KEY = "kl-cart";
export const MAX_CART_QTY = 20;

/**
 * Validates and parses raw JSON from localStorage.
 * Guaranteed never to throw; safely filters out corrupted entries,
 * missing catalog IDs, out-of-stock items, and invalid quantities.
 */
export function parseStoredCart(raw: string | null): StoredCartLine[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const seenIds = new Set<string>();
  const validLines: StoredCartLine[] = [];

  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;

    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== "string") continue;

    const product = findProduct(candidate.id);
    // Ignore items not in catalog or explicitly marked out of stock
    if (!product || product.inStock === false) continue;

    // Deduplicate IDs
    if (seenIds.has(candidate.id)) continue;

    const rawQty = candidate.qty;
    if (typeof rawQty !== "number" || !Number.isFinite(rawQty) || rawQty <= 0) {
      continue;
    }

    const clampedQty = Math.max(1, Math.min(MAX_CART_QTY, Math.floor(rawQty)));
    seenIds.add(candidate.id);
    validLines.push({ id: candidate.id, qty: clampedQty });
  }

  return validLines;
}

export function loadStoredCart(): StoredCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

/**
 * Saves cart to localStorage with error guarding against private browsing / quota errors.
 */
export function saveCart(lines: StoredCartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Fail silently on storage errors (e.g. Safari private browsing or storage quota exceeded)
  }
}
