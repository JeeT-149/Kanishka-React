import type { Category, Product } from "../types/product";

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-ctl bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-mute";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-ctl border border-ink/20 px-5 text-sm font-medium transition hover:border-ink hover:bg-sunk active:scale-[0.98]";

/**
 * Returns a Tailwind background class for the category tile.
 * Each colour is clearly distinguishable from the page background (#f7f4ee).
 *
 * single    → warm tan  (#f0e9df)
 * blends    → deeper warm grey (#e8e1d4) — was too close to page bg; now darker
 * tea       → muted sage green (#e6ede5)
 * gear      → cool grey (#e8eaed)
 * gift-box  → warm peach-kraft (#f0e4d6)
 */
export function getCategoryTileBg(category: Category, artKind?: string): string {
  if (artKind === "gift-box") return "bg-[#f0e4d6]";
  switch (category) {
    case "single":
      return "bg-[#f0e9df]";
    case "blends":
      return "bg-[#e8e1d4]";
    case "tea":
      return "bg-[#e6ede5]";
    case "gear":
      return "bg-[#e8eaed]";
    default:
      return "bg-sunk";
  }
}

export function getProductAlt(product: Product): string {
  const kind =
    product.category === "tea"
      ? "tin"
      : product.category === "gear"
        ? (product.artKind ?? "gear")
        : product.artKind === "gift-box"
          ? "gift box"
          : "pouch";
  const weightPart = product.weight ? `, ${product.weight}` : "";
  return `Kiln & Leaf ${product.name}${weightPart} ${kind}`;
}
