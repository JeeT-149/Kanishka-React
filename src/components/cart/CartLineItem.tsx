import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { findProduct } from "../../services/productService";
import { money, toMinor, formatMinor } from "../../lib/currency";
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../context/CartDrawerContext";
import type { CartItem } from "../../context/cartReducer";
import { SafeImage } from "../common/SafeImage";
import { QuantityStepper } from "../common/QuantityStepper";
import { IconTrash } from "../common/Icons";
import { getCategoryTileBg, getProductAlt } from "../../lib/styles";

export interface CartLineItemProps {
  item: CartItem;
  compact?: boolean;
  /** aria-live region to announce removal messages */
  announceRef?: React.RefObject<HTMLElement | null>;
  /** Called after the line has been removed from state */
  onRemoved?: (id: string) => void;
}

export function CartLineItem({
  item,
  compact = false,
  announceRef,
  onRemoved,
}: CartLineItemProps) {
  const { setQty, remove } = useCart();
  const { closeDrawer, lastAddedId } = useCartDrawer();
  const product = findProduct(item.id);

  const [isLeaving, setIsLeaving] = useState(false);
  // Guard flag: ensures REMOVE is dispatched exactly once even if both the
  // transitionend handler AND the 300 ms fallback timer fire in the same tick.
  const removalTriggeredRef = useRef(false);
  const timeoutFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending fallback timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutFallbackRef.current) {
        clearTimeout(timeoutFallbackRef.current);
      }
    };
  }, []);

  if (!product) return null;

  const isHighlighted = lastAddedId === item.id;
  const lineTotal = formatMinor(toMinor(product.price) * item.qty);

  const finishRemoval = () => {
    if (removalTriggeredRef.current) return;
    removalTriggeredRef.current = true;
    // Clear the fallback timer so it cannot also fire after the event path
    if (timeoutFallbackRef.current) {
      clearTimeout(timeoutFallbackRef.current);
      timeoutFallbackRef.current = null;
    }

    // Announce removal to screen readers via the aria-live region
    if (announceRef?.current) {
      announceRef.current.textContent = `Removed ${product.name} from cart`;
    }

    remove(item.id);
    onRemoved?.(item.id);
  };

  const handleRemoveClick = () => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Skip animation; remove immediately
      finishRemoval();
      return;
    }

    setIsLeaving(true);
    // Timeout fallback: ensures removal fires even if transitionend never fires
    timeoutFallbackRef.current = setTimeout(() => {
      finishRemoval();
    }, 300);
  };

  return (
    <li
      className={`line-collapse-wrapper ${isLeaving ? "is-leaving" : ""}`}
      onTransitionEnd={(e) => {
        // transitionend fires once per CSS property being transitioned.
        // Only react to grid-template-rows (the collapse dimension) on the
        // correct element, and only while we are in the leaving state.
        if (
          isLeaving &&
          e.target === e.currentTarget &&
          e.propertyName === "grid-template-rows"
        ) {
          finishRemoval();
        }
      }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="relative flex gap-4 py-5">
          {isHighlighted && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-2 inset-y-1 rounded-lg bg-accent-soft/70 animate-highlight-fade"
            />
          )}
          {(() => {
            const itemImg = product.images?.[0] ?? product.image;
            const isItemSvg = itemImg.endsWith(".svg");
            return (
              <Link to={`/product/${product.id}`} onClick={closeDrawer} className="z-10 shrink-0">
                <div
                  className={`${
                    compact ? "size-20" : "size-24 sm:size-28"
                  } rounded-lg ${
                    isItemSvg
                      ? `${getCategoryTileBg(product.category, product.artKind)} p-1.5`
                      : "bg-sunk p-0 overflow-hidden"
                  } flex items-center justify-center`}
                >
                  <SafeImage
                    src={itemImg}
                    alt={getProductAlt(product)}
                    className={`size-full ${isItemSvg ? "object-contain" : "object-cover"}`}
                  />
                </div>
              </Link>
            );
          })()}
          <div className="z-10 flex min-w-0 flex-1 flex-col">
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/product/${product.id}`}
                  onClick={closeDrawer}
                  className="line-clamp-2 font-display text-base leading-snug hover:text-accent"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 text-xs text-mute">
                  {product.weight} · {money(product.price)} each
                </p>
              </div>
              <span key={lineTotal} className="num-feedback text-sm font-medium tabular-nums">
                {lineTotal}
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <QuantityStepper
                size="sm"
                value={item.qty}
                onChange={(next) => setQty(item.id, next)}
                label={product.name}
              />
              <button
                type="button"
                onClick={handleRemoveClick}
                aria-label={`Remove ${product.name} from cart`}
                className="grid size-11 place-items-center rounded-full text-mute transition hover:bg-sunk hover:text-accent"
              >
                <IconTrash width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
