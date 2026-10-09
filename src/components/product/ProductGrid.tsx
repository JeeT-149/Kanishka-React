import { useRef } from "react";
import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";
import { useFlipGrid } from "../../hooks/useFlipGrid";

export interface ProductGridProps {
  products: Product[];
  /**
   * sortKey changes only when the sort order changes (same product set).
   * The FLIP animation runs. When the product SET changes (filter / search)
   * the parent remounts the grid via `key`, so the staggered card-entrance
   * CSS animation runs instead.
   */
  sortKey?: string;
}

export function ProductGrid({ products, sortKey = "" }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // FLIP reorder animation — only triggers when sortKey changes.
  // The hook skips on first render and under prefers-reduced-motion.
  useFlipGrid(gridRef, sortKey);

  return (
    /*
     * pt-4 ensures the first card row never touches the sticky filter bar.
     * scroll-margin-top equal to the sticky stack height (navbar ~64px +
     * filter bar ~52px = 116px) so anchor jumps land below both bars.
     */
    <div
      ref={gridRef}
      className="grid grid-cols-2 gap-x-4 gap-y-8 pt-4 scroll-mt-[116px] md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
