import { useState } from "react";
import { Link } from "react-router";
import type { Product } from "../../types/product";
import { categoryLabel } from "../../types/product";
import { money } from "../../lib/currency";
import { useCart } from "../../context/CartContext";
import { SafeImage } from "../common/SafeImage";
import { StarRating } from "../common/StarRating";
import { IconCheck } from "../common/Icons";

export interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { add } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const meta = [product.origin ?? categoryLabel(product.category), product.weight]
    .filter(Boolean)
    .join(" · ");

  const isOutOfStock = product.inStock === false;

  const handleAdd = () => {
    if (isOutOfStock) return;
    add(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <article
      className="rise group relative flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link
        to={`/product/${product.id}`}
        aria-label={`${product.name}, ${money(product.price)}`}
        className="absolute inset-0 z-10 rounded-card focus-visible:outline-2"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sunk">
        <SafeImage
          src={product.images?.[0] ?? product.image}
          alt={`${product.name}, ${product.weight ?? ""}`}
          className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.rating < 4.1 && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium text-mute shadow-2xs">
            Acquired taste
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-paper">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-2 min-h-[2.6em] font-display text-[17px] leading-snug">
          {product.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-mute">{meta}</p>

        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={product.rating} count={product.reviewCount} />
          <span className="text-sm font-medium tabular-nums">
            {money(product.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`relative z-20 mt-4 min-h-11 w-full rounded-ctl border text-sm font-medium transition active:scale-[0.98] ${
            isOutOfStock
              ? "cursor-not-allowed border-line bg-sunk text-mute opacity-70"
              : isAdded
              ? "border-accent bg-accent text-white"
              : "border-ink/20 hover:border-accent hover:bg-accent hover:text-white"
          }`}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : `Add ${product.name} to cart`
          }
        >
          <span className="inline-flex items-center gap-2" aria-live="polite">
            {isOutOfStock ? (
              "Out of stock"
            ) : isAdded ? (
              <>
                <IconCheck width={16} height={16} /> Added ✓
              </>
            ) : (
              "Add to cart"
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
