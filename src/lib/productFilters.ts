import type { Category, Product } from "../types/product";

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

/**
 * Normalizes text for search: decomposes diacritics, strips combining marks,
 * converts to lowercase, trims, and collapses consecutive whitespace.
 */
export function normalizeSearchString(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Pure filtering and sorting pipeline for products.
 * Search matches if ALL query words appear in the product's searchable text (diacritic- and case-insensitive).
 */
export function filterAndSortProducts(
  products: Product[],
  query: string,
  category: Category | "all",
  sort: string,
): Product[] {
  const normalizedQuery = normalizeSearchString(query);
  const queryWords = normalizedQuery.length > 0 ? normalizedQuery.split(" ") : [];

  const filtered = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    if (!matchesCategory) return false;

    if (queryWords.length === 0) return true;

    const haystack = normalizeSearchString(
      [
        product.name,
        product.origin ?? "",
        product.description,
        ...(product.tastingNotes ?? []),
      ].join(" "),
    );

    return queryWords.every((word) => haystack.includes(word));
  });

  const sorted = [...filtered];
  if (sort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else {
    // Default: featured rank
    sorted.sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));
  }

  return sorted;
}
