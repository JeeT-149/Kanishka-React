import { useState } from "react";
import { Link, useViewTransitionState } from "react-router";
import type { Product } from "../../types/product";
import { categoryLabel } from "../../types/product";
import { money } from "../../lib/currency";
import { useCart } from "../../context/CartContext";
import { SafeImage } from "../common/SafeImage";
import { StarRating } from "../common/StarRating";
import { IconCheck, IconPlus } from "../common/Icons";
import { getCategoryTileBg, getProductAlt } from "../../lib/styles";

export interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { add } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const to = `/product/${product.id}`;
  const isTransitioning = useViewTransitionState(to);

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

  const imgSrc = product.images?.[0] ?? product.image;
  const isSvg = imgSrc.endsWith(".svg");

  return (
    <article
      className="card-entrance group relative flex flex-col"
      style={
        {
          "--i": index < 8 ? index : 0,
        } as React.CSSProperties
      }
    >
      <Link
        to={to}
        viewTransition
        aria-label={`${product.name}, ${money(product.price)}`}
        className="absolute inset-0 z-10 rounded-card focus-visible:outline-2"
      />
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-card ${
          isSvg
            ? `${getCategoryTileBg(product.category, product.artKind)} flex items-center justify-center p-4`
            : "bg-sunk"
        }`}
      >
        <SafeImage
          src={imgSrc}
          alt={getProductAlt(product)}
          style={{
            viewTransitionName: isTransitioning ? "product-image" : "none",
          }}
          className={`size-full ${
            isSvg ? "object-contain" : "object-cover"
          } transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]`}
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

      <div className="flex flex-1 flex-col pt-3.5">
        <h3
          title={product.name}
          className="line-clamp-2 h-[2.7em] font-display text-[17px] leading-snug text-ink"
        >
          {product.name}
        </h3>
        <p className="mt-1 h-4 truncate text-xs text-mute">{meta}</p>

        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={product.rating} count={product.reviewCount} />
          <span className="text-sm font-medium tabular-nums">{money(product.price)}</span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`relative z-20 mt-auto min-h-[44px] w-full rounded-ctl border text-xs font-medium tracking-wide transition active:scale-[0.98] ${
            isOutOfStock
              ? "cursor-not-allowed border-line bg-sunk/60 text-mute opacity-60"
              : isAdded
                ? "border-accent bg-accent text-white"
                : "border-line bg-card/60 text-ink/90 [@media(hover:hover)]:hover:border-accent [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-white"
          }`}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : `Add ${product.name} to cart`
          }
        >
          <span className="inline-flex items-center justify-center gap-1.5" aria-live="polite">
            {isOutOfStock ? (
              "Out of stock"
            ) : isAdded ? (
              <>
                <IconCheck width={15} height={15} /> Added ✓
              </>
            ) : (
              <>
                <IconPlus width={15} height={15} /> Add to cart
              </>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
