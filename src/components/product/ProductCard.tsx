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

const MAX_CART_QTY = 20;

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { add, lines } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const to = `/product/${product.id}`;
  const isTransitioning = useViewTransitionState(to);

  const meta = [product.origin ?? categoryLabel(product.category), product.weight]
    .filter(Boolean)
    .join(" · ");

  const isOutOfStock = product.inStock === false;
  const currentLine = lines.find((l) => l.id === product.id);
  const isMaxInCart = (currentLine?.qty ?? 0) >= MAX_CART_QTY;

  const handleAdd = () => {
    if (isOutOfStock || isMaxInCart) return;
    add(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const imgSrc = product.images?.[0] ?? product.image;
  const notesSrc = product.images?.[1] ?? null;
  const isSvg = imgSrc.endsWith(".svg");

  const quickAddLabel = isOutOfStock
    ? `${product.name} is out of stock`
    : isMaxInCart
      ? `${product.name} is at maximum cart quantity`
      : `Add ${product.name} to cart`;

  const quickAddText = isOutOfStock
    ? "Out of stock"
    : isMaxInCart
      ? "Maximum in cart"
      : isAdded
        ? "Added ✓"
        : "Add to cart";

  return (
    <article
      data-flip-id={product.id}
      className="card-entrance group relative grid grid-rows-subgrid row-span-4 [@media(hover:none)]:row-span-5"
      style={{ "--i": index < 8 ? index : 0 } as React.CSSProperties}
    >
      {/*
        The article uses CSS subgrid (grid-template-rows: subgrid) when placed
        inside a subgrid-aware ProductGrid. This means the title, meta, rating
        and action rows snap to shared row tracks across all cards in a row,
        eliminating the fixed-height h-[2.7em] hack.
      */}

      {/* Product link covers the whole card but is a sibling to the quick-add button,
          not its parent — keeps interactive elements separate (no nested buttons). */}
      <Link
        to={to}
        viewTransition
        aria-label={`${product.name}, ${money(product.price)}`}
        className="absolute inset-0 z-10 rounded-card focus-visible:outline-2"
        tabIndex={0}
      />

      {/* Image tile */}
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-card ${
          isSvg
            ? `${getCategoryTileBg(product.category, product.artKind)} flex items-center justify-center p-4`
            : "bg-sunk"
        }`}
      >
        {/* Primary pack image */}
        <SafeImage
          src={imgSrc}
          alt={getProductAlt(product)}
          style={{ viewTransitionName: isTransitioning ? "product-image" : "none" }}
          className={`size-full transition-opacity duration-300 ${
            isSvg ? "object-contain" : "object-cover"
          } [@media(hover:hover)]:group-hover:opacity-0`}
        />

        {/* Notes / crossfade image — only on hover-capable devices */}
        {notesSrc && (
          <SafeImage
            src={notesSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className={`absolute inset-0 size-full opacity-0 transition-opacity duration-300 ${
              notesSrc.endsWith(".svg") ? "object-contain p-4" : "object-cover"
            } [@media(hover:hover)]:group-hover:opacity-100`}
          />
        )}

        {/* Badges */}
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

        {/*
          Hover quick-add button — slide up from the bottom of the image tile.
          Only shown on hover-capable devices. On touch devices the full-width
          button below is always visible.

          It is a sibling to the card Link, not a child, so there are no
          nested interactive elements.

          z-20 ensures it sits above the invisible overlay link.
        */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock || isMaxInCart}
          aria-label={quickAddLabel}
          className={`
            absolute inset-x-3 bottom-3 z-20
            hidden [@media(hover:hover)]:flex
            min-h-[44px] items-center justify-center gap-1.5
            rounded-ctl border text-xs font-medium tracking-wide
            opacity-0 translate-y-2 pointer-events-none
            transition-[opacity,transform] duration-200
            group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
            group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
            focus-within:opacity-100 focus-within:translate-y-0 focus-within:pointer-events-auto
            focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:pointer-events-auto
            active:scale-[0.98]
            ${
              isOutOfStock || isMaxInCart
                ? "cursor-not-allowed border-line bg-sunk/80 text-mute opacity-60"
                : isAdded
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-card/90 text-ink/90 hover:border-accent hover:bg-accent hover:text-white"
            }
          `}
        >
          <span className="inline-flex items-center justify-center gap-1.5" aria-live="polite">
            {isAdded ? (
              <>
                <IconCheck width={14} height={14} /> {quickAddText}
              </>
            ) : (
              <>
                <IconPlus width={14} height={14} /> {quickAddText}
              </>
            )}
          </span>
        </button>
      </div>

      {/*
        Title, meta, rating/price, and action button participate in CSS subgrid.
        They are direct children of article, aligning across all cards in each row.
      */}
      <h3
        title={product.name}
        className="line-clamp-2 pt-3.5 font-display text-[17px] leading-snug text-ink"
      >
        {product.name}
      </h3>
      <p className="mt-1 truncate text-xs text-mute">{meta}</p>

      <div className="mt-3 flex items-center justify-between">
        <StarRating rating={product.rating} count={product.reviewCount} />
        <span className="text-sm font-medium tabular-nums">{money(product.price)}</span>
      </div>

      {/*
        Touch / always-visible add button (hidden on hover-capable devices).
        At least 44px tall per WCAG guidelines.
      */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock || isMaxInCart}
        className={`
          relative z-20 mt-3.5 min-h-[44px] w-full rounded-ctl border text-xs font-medium tracking-wide
          transition active:scale-[0.98]
          [@media(hover:hover)]:hidden
          ${
            isOutOfStock || isMaxInCart
              ? "cursor-not-allowed border-line bg-sunk/60 text-mute opacity-60"
              : isAdded
                ? "border-accent bg-accent text-white"
                : "border-line bg-card/60 text-ink/90"
          }
        `}
        aria-label={quickAddLabel}
      >
        <span className="inline-flex items-center justify-center gap-1.5" aria-live="polite">
          {isOutOfStock ? (
            "Out of stock"
          ) : isMaxInCart ? (
            "Maximum in cart"
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
    </article>
  );
}
