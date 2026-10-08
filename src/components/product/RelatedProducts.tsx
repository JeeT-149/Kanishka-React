import type { Product } from "../../types/product";
import { getAllProducts } from "../../services/productService";
import { ProductCard } from "./ProductCard";

export interface RelatedProductsProps {
  currentProduct: Product;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = getAllProducts()
    .filter(
      (item) =>
        item.category === currentProduct.category && item.id !== currentProduct.id,
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 border-t border-line pt-10" aria-labelledby="related">
      <h2 id="related" className="font-display text-3xl font-light">
        You may also like
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {related.map((item, index) => (
          <ProductCard key={item.id} product={item} index={index} />
        ))}
      </div>
    </section>
  );
}
