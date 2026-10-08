import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { money } from "../../lib/currency";
import { btnPrimary } from "../../lib/styles";

export interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { count, subtotal } = useCart();
  const [showNote, setShowNote] = useState(false);

  const handleCheckout = () => {
    setShowNote(true);
    onCheckout?.();
  };

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-mute">Items</dt>
        <dd key={count} className="num-feedback tabular-nums">{count}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-mute">Subtotal</dt>
        <dd key={subtotal} className="num-feedback tabular-nums">{money(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-mute">Shipping</dt>
        <dd className="text-mute">Free</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
        <dt>Total</dt>
        <dd key={subtotal} className="num-feedback tabular-nums font-semibold">{money(subtotal)}</dd>
      </div>
      <button
        type="button"
        className={`${btnPrimary} mt-4 w-full`}
        onClick={handleCheckout}
      >
        Checkout
      </button>
      {showNote && (
        <p role="status" className="fade mt-3 text-center text-xs text-mute">
          Checkout is a placeholder in this showcase.
        </p>
      )}
    </dl>
  );
}
