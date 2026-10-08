import type { Category, Product } from "../types/product";

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

/**
 * Pure filtering and sorting pipeline for products.
 */
export function filterAndSortProducts(
  products: Product[],
  query: string,
  category: Category | "all",
  sort: string,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const searchableText = [
      product.name,
      product.origin ?? "",
      ...(product.tastingNotes ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    return matchesCategory && matchesQuery;
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
