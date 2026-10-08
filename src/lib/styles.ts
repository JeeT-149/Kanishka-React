import type { Category, Product } from "../types/product";

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-ctl bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-mute";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-ctl border border-ink/20 px-5 text-sm font-medium transition hover:border-ink hover:bg-sunk active:scale-[0.98]";

export function getCategoryTileBg(category: Category, artKind?: string): string {
  if (artKind === "gift-box") return "bg-[#f5ede2]";
  switch (category) {
    case "single":
      return "bg-[#f4ede4]";
    case "blends":
      return "bg-[#f7f2ea]";
    case "tea":
      return "bg-[#edf3ec]";
    case "gear":
      return "bg-[#eef0f2]";
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
