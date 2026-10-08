# Kiln & Leaf — Storefront

A mini e-commerce storefront for **Kiln & Leaf Roasters**, a specialty coffee roastery and rare-leaf tea blender based in Bengaluru.

The storefront is built with Vite, React 19, TypeScript (strict mode), Tailwind CSS v4, and React Router.

---

## Features

- **Product Catalog**: 22 artisanal coffees, rare teas, and brew gear sourced from local JSON (`src/data/products.json`).
- **Search & Filtering**: Real-time debounced text search, category tabs (All, Single Origin, Blends, Tea, Brew Gear), and sort orders (Featured, Price: low to high, Price: high to low, Top rated).
- **URL-Synced Navigation**: Search query (`q`), category (`cat`), and sort order (`sort`) persist in URL search parameters to support refresh, bookmarking, and browser history navigation.
- **Product Details**: Dedicated detail page with gallery thumbnails, roast meter, origin details, tasting notes, brew recipes, out-of-stock handling, and related products.
- **Cart Management**: Add, remove, increment, and decrement quantities, persisted in `localStorage`. Includes both an accessible slide-over drawer and a dedicated `/cart` page.
- **Resilient State Handling**: Skeleton loading states for grids and detail pages, simulated network error recovery with retries, empty search state with filter reset, and dedicated "Product not found" screen.
- **Accessibility (a11y)**: Focus trap in cart drawer, Esc key closing, focus restored to trigger element, `aria-live` feedback on cart and stepper interactions, labelled controls, and high-contrast WCAG AA/AAA tokens.
- **INR Currency Formatting**: Realistically priced Indian rupee (₹) amounts formatted via `Intl.NumberFormat`, with cart math computed in paise (minor units) to prevent floating-point rounding errors.

---

## Tech Stack

- **Core**: [React 19](https://react.dev/) + React DOM 19
- **Build & Dev Server**: [Vite 8](https://vite.dev/) with `@vitejs/plugin-react`
- **Routing**: [React Router 8](https://reactrouter.com/) (Browser router with `<ScrollRestoration />`)
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Tooling**: ESLint 9 (typescript-eslint, react-hooks, react-refresh) and Prettier

---

## Project Structure

```
src/
├── main.tsx                         # DOM entrypoint
├── App.tsx                          # App providers & router mount
├── router.tsx                       # Route definitions (browser router)
├── index.css                        # Design tokens & animations
├── types/
│   └── product.ts                   # Product, Category, RoastLevel types
├── data/
│   └── products.json                # Single source of truth (22 products)
├── lib/
│   ├── currency.ts                  # formatINR, toMinor, fromMinor helpers
│   ├── productFilters.ts            # Pure filtering and sorting pipeline
│   └── styles.ts                    # Reusable button token classes
├── services/
│   └── productService.ts            # Typed async fetching & sync lookup
├── context/
│   ├── CartContext.tsx              # CartProvider & useCart hook
│   ├── CartDrawerContext.tsx        # Isolated UI drawer state & hook
│   ├── cartReducer.ts               # Pure cart reducer & action types
│   └── cartStorage.ts               # Validated localStorage parsing & save
├── hooks/
│   ├── useProducts.ts               # Catalog query hook with loading/error/retry
│   ├── useProduct.ts                # Single product query with not-found state
│   ├── useDebounce.ts               # Input debounce helper (250ms)
│   └── useDocumentTitle.ts          # Per-page title synchronization
├── components/
│   ├── layout/                      # Layout, Navbar, Footer, CartDrawer
│   ├── product/                     # ProductCard, ProductGrid, SearchBar, CategoryPills, SortSelect, RoastMeter, RelatedProducts
│   ├── cart/                        # CartLineItem, CartSummary
│   ├── common/                      # QuantityStepper, StarRating, SafeImage, Logo, Icons
│   └── feedback/                    # ProductGridSkeleton, ProductDetailSkeleton, EmptyState, ErrorState
└── pages/
    ├── Home.tsx                     # Storefront catalog & filter view
    ├── ProductDetail.tsx            # Detail view with gallery & related items
    ├── Cart.tsx                     # Full-page cart overview & order summary
    └── NotFound.tsx                 # Generic 404 page
```

---

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

---

## Setup & Run

Clone the repository and install dependencies:

```bash
npm install
```

### Available Scripts

- **`npm run dev`**: Starts local Vite development server at `http://localhost:5173`.
- **`npm run build`**: Runs TypeScript type checking (`tsc -b`) followed by Vite production bundle build.
- **`npm run preview`**: Previews the built production bundle locally.
- **`npm run lint`**: Runs ESLint across all source files.
- **`npm run format`**: Formats all codebase files with Prettier.

---

## Demo Flags & Test Scenarios

The catalog service includes built-in inspection hooks to test loading, error, and boundary states:

- **Simulate Infinite Loading**: Append `?demo=loading` to any catalog URL (e.g. `http://localhost:5173/?demo=loading` or `/product/ethiopia-yirgacheffe?demo=loading`).
- **Simulate Network Failure**: Append `?demo=error` to trigger simulated service rejection and test the `ErrorState` retry mechanism.
- **Empty Search State**: Search for an unlisted term or append `?q=nonsense` on the home page.
- **Dedicated Product Not Found**: Navigate to any invalid product id (e.g. `/product/xyz-invalid-bean`).
- **Out of Stock Item**: View `decaf-swiss-water` on the shop grid or detail page to inspect disabled cart controls and badge.
- **Quantity Cap**: Increase any line item in the cart or detail page to 20 to test the order limit helper and button deactivation.

---

## Decisions & Assumptions

1. **State Management**: Cart state uses `useReducer` rather than external state libraries to keep the bundle lean and logic easily traceable. Actions are strictly defined (`ADD`, `SET_QTY`, `REMOVE`, `CLEAR`, `SYNC`).
2. **Normalized Cart Persistence**: The cart persists only `{ id, qty }` lines in `localStorage`. Prices, titles, weights, and images are derived synchronously from the catalog to prevent price tampering or stale stored prices.
3. **Validated LocalStorage Parsing**: `parseStoredCart` never throws. Non-array JSON, invalid IDs, corrupted quantities, or items no longer in stock are dropped during parsing, with quantities clamped between 1 and 20.
4. **Paise-Based Currency Math**: Calculations are computed in integer paise (minor units) to avoid floating-point math inaccuracies (e.g. `0.1 + 0.2 !== 0.3`) before formatting to INR strings via `Intl.NumberFormat`.
5. **Simulated Network Delay**: Catalog data is bundled in static JSON (`products.json`), but loaded via an asynchronous service with a 500ms delay to exercise loading skeletons, suspense-like transitions, and error states.
6. **Quantity Limit**: Orders enforce a maximum of 20 units per line item. Steppers disable the increment button and display "Maximum 20 per order".
7. **URL-Synchronized Filter State**: Search query, category filter, and sort order are stored directly in browser search parameters, debounced at 250ms to prevent history thrashing while preserving back/forward browser support.
8. **Client-Side Routing on Deployments**: SPA rewrites are included via `public/_redirects` (Netlify/Cloudflare) and `vercel.json` (Vercel) to support deep linking on direct navigation to `/product/:id` and `/cart`.

---

## Note on Development

AI tools were used during initial wireframe exploration, asset sourcing, and design scaffolding. All component architectures, strict TypeScript definitions, state reducers, localStorage guards, accessibility features, and routing pipelines were manually reviewed, refactored, and finalized for production quality.
