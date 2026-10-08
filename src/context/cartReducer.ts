import { findProduct } from "../services/productService";
import { MAX_CART_QTY, type StoredCartLine } from "./cartStorage";

export type CartItem = StoredCartLine;

export type CartAction =
  | { type: "ADD"; id: string; qty?: number }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "SYNC"; lines: CartItem[] };

/**
 * Pure reducer handling cart modifications.
 * Enforces quantity bounds (1 to 20) and blocks out-of-stock additions.
 */
export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const product = findProduct(action.id);
      if (!product || product.inStock === false) {
        return state;
      }

      const increment = Math.max(1, Math.min(MAX_CART_QTY, action.qty ?? 1));
      const existing = state.find((item) => item.id === action.id);

      if (existing) {
        const nextQty = Math.min(MAX_CART_QTY, existing.qty + increment);
        return state.map((item) =>
          item.id === action.id ? { ...item, qty: nextQty } : item,
        );
      }

      return [...state, { id: action.id, qty: increment }];
    }

    case "SET_QTY": {
      // Clamped to 1-20. Quantities cannot drop below 1; removing is an explicit action.
      const clamped = Math.max(1, Math.min(MAX_CART_QTY, Math.floor(action.qty)));
      return state.map((item) =>
        item.id === action.id ? { ...item, qty: clamped } : item,
      );
    }

    case "REMOVE": {
      return state.filter((item) => item.id !== action.id);
    }

    case "CLEAR": {
      return [];
    }

    case "SYNC": {
      return action.lines;
    }

    default:
      return state;
  }
}
