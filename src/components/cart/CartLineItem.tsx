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
}

export function CartLineItem({ item, compact = false }: CartLineItemProps) {
  const { setQty, remove } = useCart();
  const { closeDrawer } = useCartDrawer();
  const product = findProduct(item.id);

  if (!product) return null;

  const lineTotal = formatMinor(toMinor(product.price) * item.qty);

  return (
    <li className="rise flex gap-4 py-5">
      <Link to={`/product/${product.id}`} onClick={closeDrawer} className="shrink-0">
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
      <div className="flex min-w-0 flex-1 flex-col">
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
          <span className="text-sm font-medium tabular-nums">{lineTotal}</span>
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
            onClick={() => remove(item.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="grid size-11 place-items-center rounded-full text-mute transition hover:bg-sunk hover:text-accent"
          >
            <IconTrash width={18} height={18} />
          </button>
        </div>
      </div>
    </li>
  );
}
