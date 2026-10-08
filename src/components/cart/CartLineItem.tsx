import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { findProduct } from "../../services/productService";
import { money, toMinor, formatMinor } from "../../lib/currency";
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useToast } from "../../context/ToastContext";
import type { CartItem } from "../../context/cartReducer";
import { SafeImage } from "../common/SafeImage";
import { QuantityStepper } from "../common/QuantityStepper";
import { IconTrash } from "../common/Icons";
import { getCategoryTileBg, getProductAlt } from "../../lib/styles";

export interface CartLineItemProps {
  item: CartItem;
  compact?: boolean;
}

export function CartLineItem({ item, compact = false }: CartLineItemProps) {
  const { add, setQty, remove } = useCart();
  const { closeDrawer, lastAddedId } = useCartDrawer();
  const { showToast } = useToast();
  const product = findProduct(item.id);

  const [isLeaving, setIsLeaving] = useState(false);
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
    if (timeoutFallbackRef.current) {
      clearTimeout(timeoutFallbackRef.current);
      timeoutFallbackRef.current = null;
    }

    const removedQty = item.qty;
    remove(item.id);

    showToast(`Removed ${product.name}`, {
      label: "Undo",
      onClick: () => {
        // Note: Undo re-adds the product with its previous quantity; list position may change (item appended to end).
        add(product.id, removedQty);
      },
    });
  };

  const handleRemoveClick = () => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      finishRemoval();
      return;
    }

    setIsLeaving(true);
    // Timeout fallback ensures line item is removed even if onTransitionEnd does not fire
    timeoutFallbackRef.current = setTimeout(() => {
      finishRemoval();
    }, 300);
  };

  return (
    <li
      className={`line-collapse-wrapper ${isLeaving ? "is-leaving" : ""}`}
      onTransitionEnd={(e) => {
        if (
          isLeaving &&
          e.target === e.currentTarget &&
          (e.propertyName === "grid-template-rows" || e.propertyName === "opacity")
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
          <Link to={`/product/${product.id}`} onClick={closeDrawer} className="z-10 shrink-0">
            <div
              className={`${
                compact ? "size-20" : "size-24 sm:size-28"
              } rounded-lg ${getCategoryTileBg(
                product.category,
                product.artKind,
              )} p-1.5 flex items-center justify-center`}
            >
              <SafeImage
                src={product.images?.[0] ?? product.image}
                alt={getProductAlt(product)}
                className="size-full object-contain"
              />
            </div>
          </Link>
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
