import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { findProduct } from "../services/productService";
import { toMinor, fromMinor } from "../lib/currency";
import {
  CART_STORAGE_KEY,
  loadStoredCart,
  parseStoredCart,
  saveCart,
} from "./cartStorage";
import { cartReducer, type CartItem } from "./cartReducer";

export interface CartContextValue {
  lines: CartItem[];
  count: number;
  subtotal: number;
  subtotalMinor: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state via lazy initializer reading localStorage once
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadStoredCart);

  // Single effect persisting state on every change
  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  // Sync across tabs when another tab modifies the cart in localStorage
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        const synced = parseStoredCart(event.newValue);
        dispatch({ type: "SYNC", lines: synced });
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Compute total units derived with useMemo
  const count = useMemo(() => {
    return lines.reduce((total, line) => total + line.qty, 0);
  }, [lines]);

  // Compute subtotal in minor units (paise) derived with useMemo
  const subtotalMinor = useMemo(() => {
    return lines.reduce((sum, line) => {
      const product = findProduct(line.id);
      if (!product) return sum;
      return sum + toMinor(product.price) * line.qty;
    }, 0);
  }, [lines]);

  // Derive human-readable subtotal in major units (rupees)
  const subtotal = useMemo(() => fromMinor(subtotalMinor), [subtotalMinor]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      subtotalMinor,
      add: (id, qty = 1) => dispatch({ type: "ADD", id, qty }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
    }),
    [lines, count, subtotal, subtotalMinor],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
