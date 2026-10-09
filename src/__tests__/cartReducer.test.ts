import { describe, it, expect, vi, beforeEach } from "vitest";
import { cartReducer, type CartItem } from "../context/cartReducer";
import * as productService from "../services/productService";

describe("cartReducer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds a new line to an empty cart", () => {
    const initialState: CartItem[] = [];
    const nextState = cartReducer(initialState, {
      type: "ADD",
      id: "chikmagalur-estate",
      qty: 1,
    });

    expect(nextState).toEqual([{ id: "chikmagalur-estate", qty: 1 }]);
  });

  it("increases quantity when adding an existing line", () => {
    const initialState: CartItem[] = [{ id: "chikmagalur-estate", qty: 2 }];
    const nextState = cartReducer(initialState, {
      type: "ADD",
      id: "chikmagalur-estate",
      qty: 3,
    });

    expect(nextState).toEqual([{ id: "chikmagalur-estate", qty: 5 }]);
  });

  it("caps quantity at 20 when adding to an existing line", () => {
    const initialState: CartItem[] = [{ id: "chikmagalur-estate", qty: 18 }];
    const nextState = cartReducer(initialState, {
      type: "ADD",
      id: "chikmagalur-estate",
      qty: 5,
    });

    expect(nextState).toEqual([{ id: "chikmagalur-estate", qty: 20 }]);
  });

  it("clamps SET_QTY between 1 and 20", () => {
    const initialState: CartItem[] = [{ id: "chikmagalur-estate", qty: 5 }];

    // Clamps below 1 to 1
    const clampedLow = cartReducer(initialState, {
      type: "SET_QTY",
      id: "chikmagalur-estate",
      qty: 0,
    });
    expect(clampedLow).toEqual([{ id: "chikmagalur-estate", qty: 1 }]);

    // Clamps above 20 to 20
    const clampedHigh = cartReducer(initialState, {
      type: "SET_QTY",
      id: "chikmagalur-estate",
      qty: 25,
    });
    expect(clampedHigh).toEqual([{ id: "chikmagalur-estate", qty: 20 }]);

    // Sets valid integer within range
    const valid = cartReducer(initialState, {
      type: "SET_QTY",
      id: "chikmagalur-estate",
      qty: 8,
    });
    expect(valid).toEqual([{ id: "chikmagalur-estate", qty: 8 }]);
  });

  it("removes a line item by id", () => {
    const initialState: CartItem[] = [
      { id: "chikmagalur-estate", qty: 2 },
      { id: "monsooned-malabar", qty: 1 },
    ];
    const nextState = cartReducer(initialState, {
      type: "REMOVE",
      id: "chikmagalur-estate",
    });

    expect(nextState).toEqual([{ id: "monsooned-malabar", qty: 1 }]);
  });

  it("rejects adding an out-of-stock product", () => {
    vi.spyOn(productService, "findProduct").mockReturnValue({
      id: "sold-out-blend",
      name: "Sold Out Blend",
      category: "blends",
      price: 550,
      rating: 4.8,
      image: "/test.svg",
      images: ["/test.svg"],
      inStock: false,
      about: "Test about story.",
      details: [{ label: "Origin", value: "Test" }],
      box: ["250g coffee"],
    });

    const initialState: CartItem[] = [];
    const nextState = cartReducer(initialState, {
      type: "ADD",
      id: "sold-out-blend",
      qty: 1,
    });

    expect(nextState).toEqual([]);
  });
});
