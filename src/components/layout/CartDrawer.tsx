import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { CartLineItem } from "../cart/CartLineItem";
import { CartSummary } from "../cart/CartSummary";
import { EmptyState } from "../feedback/EmptyState";
import { IconArrow, IconBag, IconX } from "../common/Icons";
import { btnPrimary } from "../../lib/styles";

export function CartDrawer() {
  const { isOpen, closeDrawer } = useCartDrawer();
  const { lines, count } = useCart();
  const asideRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Retain the trigger element that opened the drawer to restore focus on close
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";

      // Focus close button inside drawer after render
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
        triggerElementRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }

      // Enforce focus trap within the modal dialog
      if (e.key === "Tab" && asideRef.current) {
        const focusable = asideRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        inert={!isOpen}
        className={`absolute bottom-0 right-0 top-0 flex h-full w-full flex-col bg-paper shadow-soft transition-transform duration-300 ease-out sm:w-[440px] ${
          isOpen
            ? "translate-x-0 translate-y-0"
            : "max-sm:translate-y-full max-sm:translate-x-0 sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="cart-drawer-heading" className="font-display text-2xl">
            Your cart <span key={count} className="num-feedback inline-block text-base text-mute">({count})</span>
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="grid size-11 place-items-center rounded-full hover:bg-sunk focus-visible:outline-2"
          >
            <IconX />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex-1 overflow-auto">
            <EmptyState
              icon={<IconBag width={28} height={28} />}
              title="Your cart is empty"
              message="Nothing here yet. Fresh roasts ship within 48 hours."
              action={
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => {
                    closeDrawer();
                    navigate("/");
                  }}
                >
                  Continue shopping
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-auto px-6">
              <ul className="divide-y divide-line">
                {lines.map((item) => (
                  <CartLineItem key={item.id} item={item} compact />
                ))}
              </ul>
            </div>
            <footer className="border-t border-line bg-card px-6 py-5">
              <CartSummary />
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="mt-3 flex min-h-11 items-center justify-center gap-1.5 text-sm text-mute underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2"
              >
                View full cart <IconArrow width={14} height={14} />
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
