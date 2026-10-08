# Kiln & Leaf — Storefront

A mini e-commerce storefront for **Kiln & Leaf Roasters**, a specialty coffee roastery and rare-leaf tea blender based in Bengaluru.

The storefront is built with Vite, React 19, TypeScript (strict mode), Tailwind CSS v4, and React Router.

**Live Demo:** [https://kiln-and-leaf.vercel.app](https://kiln-and-leaf.vercel.app) *(Candidate: replace with your deployment URL)*

---

## Screenshots

### Desktop Experience
| Catalog & Filters | Product Detail | Slide-Over Cart Drawer |
|:---:|:---:|:---:|
| ![Desktop Catalog](docs/screenshots/desktop-listing.png) | ![Desktop Detail](docs/screenshots/desktop-detail.png) | ![Desktop Drawer](docs/screenshots/desktop-drawer.png) |

### Mobile Experience
| Mobile Catalog (390px) | Mobile Cart Sheet (390px) |
|:---:|:---:|
| ![Mobile Catalog](docs/screenshots/mobile-listing.png) | ![Mobile Drawer](docs/screenshots/mobile-drawer.png) |

---

## Features

- **Product Catalog**: 28 artisanal coffees, Indian estate lots, rare-leaf teas, and brew gear sourced from local JSON (`src/data/products.json`).
- **Dynamic Packaging Art**: Zero third-party image dependencies; packaging SVGs are generated programmatically so printed labels always match catalog metadata.
- **Robust Search & Filtering**: Diacritic-insensitive and case-insensitive search (`"volcan"` finds *"Antigua Volcán de Fuego"*), multi-word matching (`"ethiopia washed"`), category filtering, and sorting.
- **URL-Synced Navigation**: Search query (`q`), category (`cat`), and sort order (`sort`) persist in URL search parameters to support refresh, bookmarking, and browser history navigation.
- **Product Details**: Dedicated detail page with gallery thumbnails, roast meter, origin details, tasting notes, brew recipes, out-of-stock handling, and related products.
- **CSS-First Motion System**: Shared-element view transitions for product images, staggered grid entrances, roast meter animation, and micro-interactions.
- **Cart Management & Micro-Interactions**: Slide-over drawer on desktop, bottom sheet on mobile, smooth line item removal animation with CSS grid collapse (`grid-template-rows: 1fr to 0fr`), 1.2s newly added item highlight flash, subtle number change feedback, and an Undo removal toast.
- **Resilient State Handling**: Skeleton loading states for grids and detail pages, simulated network error recovery with retries, empty search state with filter reset, and dedicated "Product not found" screen.
- **Accessibility (a11y)**: Focus trap in cart drawer, Esc key closing, focus restored to trigger element, `aria-live` feedback on cart and stepper interactions, labelled controls, and high-contrast WCAG AA/AAA tokens.
- **INR Currency Formatting**: Realistically priced Indian rupee (₹) amounts formatted via `Intl.NumberFormat` with Indian lakh grouping, with cart math computed in paise (minor units) to prevent floating-point rounding errors.

---

## Tech Stack

- **Core**: [React 19](https://react.dev/) + React DOM 19
- **Build & Dev Server**: [Vite 8](https://vite.dev/) with `@vitejs/plugin-react`
- **Routing**: [React Router 8](https://reactrouter.com/) (Browser router with `<ScrollRestoration />` and View Transitions)
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Testing**: [Vitest 5](https://vitest.dev/)
- **Tooling**: ESLint 9 (typescript-eslint, react-hooks, react-refresh) and Prettier

---

## Project Structure

```
src/
├── main.tsx                         # DOM entrypoint
├── App.tsx                          # App providers (Cart, Toast, CartDrawer) & router mount
├── router.tsx                       # Route definitions (browser router)
├── index.css                        # Design tokens, motion system & animations
├── types/
│   └── product.ts                   # Product, Category, RoastLevel, ArtKind types
├── data/
│   └── products.json                # Single source of truth (28 products)
├── lib/
│   ├── currency.ts                  # formatINR, toMinor, fromMinor helpers
│   ├── productFilters.ts            # Diacritic-insensitive filtering & sorting pipeline
│   └── styles.ts                    # Category tile backgrounds & button tokens
├── services/
│   └── productService.ts            # Typed async fetching & sync lookup
├── context/
│   ├── CartContext.tsx              # CartProvider & useCart hook (paise math & sync)
│   ├── CartDrawerContext.tsx        # Isolated UI drawer state & lastAddedId tracking
│   ├── ToastContext.tsx             # Single auto-dismissing toast with hover/focus pause
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
│   ├── common/                      # Toast, QuantityStepper, StarRating, SafeImage, Logo, Icons
│   └── feedback/                    # ProductGridSkeleton, ProductDetailSkeleton, EmptyState, ErrorState
├── pages/
│   ├── Home.tsx                     # Storefront catalog & filter view
│   ├── ProductDetail.tsx            # Detail view with gallery & related items
│   ├── Cart.tsx                     # Full-page cart overview & order summary
│   └── NotFound.tsx                 # Generic 404 page
└── __tests__/
    ├── cartReducer.test.ts          # Add, qty cap, clamp, remove, out-of-stock tests
    ├── cartStorage.test.ts          # JSON corruption, clamping, deduplication tests
    ├── productFilters.test.ts       # Diacritics, multi-word, categories, sorting tests
    └── currency.test.ts             # Lakh grouping, paise conversion tests
```

---

## Setup & Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit test suite (Vitest)
npm test

# Run tests in watch mode
npm run test:watch

# Generate product packaging SVGs
npm run art

# Typecheck and production bundle build
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint

# Format code with Prettier
npm run format
```

---

## Packaging Art Generation (`npm run art`)

All 56 product visuals (28 packaging fronts and 28 cupping notes cards) are generated using `scripts/generate-product-art.mjs` (plain Node ESM, zero dependencies).

### Why Generated Art?
1. **Accurate Typography & Branding**: Third-party stock photos frequently show contradictory labels (e.g. Darjeeling tins on Oolong teas, or mismatched roast names). Generated SVGs read directly from `src/data/products.json`, guaranteeing that names, weights, origins, and roast dots always match product data.
2. **Deterministic & Lightweight**: Self-contained vector SVGs average only ~3 KB each, load instantly without network latency or external CDN rate limits, and scale crisply to any resolution.
3. **Color Coding**: Single origins use roast-derived earth tones (warm sand for light, terracotta for medium, charcoal for dark); teas use type-specific canisters (forest green, deep black, muted teal, saffron); gear uses clean, tasteful flat vector illustrations without printed text.
4. **Theme Ready**: SVGs use transparent backgrounds, allowing the parent card tile to provide token-based category-tinted backgrounds.

---

## Motion System & View Transitions

Kiln & Leaf uses a CSS-first motion system designed around browser performance and compositor-friendly properties (`transform` and `opacity`):

- **Tokens**: Motion tokens are declared in `src/index.css` via `@theme` (`--duration-fast: 160ms`, `--duration-base: 240ms`, `--duration-slow: 420ms`, `--duration-reveal: 700ms`, `--ease-out`, `--ease-in-out`).
- **Hero Reveal**: Headline reveals line-by-line with staggered transforms and opacity, the italic accent completes last, followed by supporting copy.
- **Catalog Grid Entrance**: On load and filter changes, the first 8 cards animate in with a 40ms stagger (`calc(var(--i) * 40ms)`).
- **Card Hover**: Cards maintain stable position while the pack image gently zooms to `1.03` over 500ms inside an `overflow-hidden` tile on hover-capable devices (`@media (hover: hover)`).
- **Shared-Element Transitions**: React Router 8's `viewTransition` prop pairs with `useViewTransitionState` to assign `view-transition-name: product-image` only to the navigating card's image, morphing smoothly into the detail page hero image. The navbar uses `view-transition-name: main-navbar` with animation disabled to remain rock steady.
- **Cart Line Removal Collapse**: When a cart line is removed, it animates out using `opacity` and CSS grid row collapse (`grid-template-rows: 1fr to 0fr`) on an inner `min-h-0 overflow-hidden` wrapper with an `onTransitionEnd` handler and timeout fallback before updating state.
- **Newly Added Highlight**: Adding an item from the detail page highlights that line in the cart drawer with a subtle 1.2s background opacity fade.
- **Undo Removal Toast**: Removing an item shows a transient toast with an "Undo" action. The toast uses `role="status"` and `aria-live="polite"`, auto-dismisses after 5 seconds, and automatically pauses its timer when hovered or focused.
- **Reduced Motion Compliance**: Under `prefers-reduced-motion: reduce`, all animations and view transitions are eliminated or reduced to 0.001ms, ensuring users sensitive to motion experience instant, comfortable transitions.

---

## Testing (`npm test`)

The test suite runs with **Vitest 5** and contains 29 unit tests designed to be deterministic and fast (< 200ms total runtime):

1. **`cartReducer.test.ts`**: Verifies adding new items, incrementing quantities, capping lines at 20 units, clamping `SET_QTY` between 1 and 20, removing lines, and rejecting out-of-stock items.
2. **`cartStorage.test.ts`**: Tests `parseStoredCart` resilience against `null`, malformed JSON, non-array types, primitive strings, unregistered catalog IDs, non-finite/negative/oversized quantities, and duplicates.
3. **`productFilters.test.ts`**: Verifies diacritic stripping (`"volcan"` finds `"Antigua Volcán de Fuego"`), multi-word matching where all terms must appear (`"ethiopia washed"`), category filtering, sort orders (price asc/desc, rating, featured), and empty result sets.
4. **`currency.test.ts`**: Tests Indian numbering format with lakh grouping (`₹1,25,000`), integer formatting without `.00`, decimal handling, paise conversions (`toMinor` / `fromMinor`), and rounding protections.

---

## Deployment & Routing

The project uses client-side single-page app (SPA) routing with React Router.

- **Vercel**: Configured in `vercel.json` with rewrite rules directing all paths to `/index.html`:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
- **Netlify Equivalent**: If deploying to Netlify, include `/* /index.html 200` in a `public/_redirects` file or specify the redirect in `netlify.toml`.

---

## Decisions & Assumptions

1. **Add-to-Cart Flow Rationale (Grid Inline vs Detail Drawer)**: On the home grid, quick-add stays inline with brief visual feedback ("Added ✓") so shoppers can rapidly browse and add multiple items without disrupting their scrolling flow. Conversely, on the Product Detail page, adding an item represents focused purchase intent for that specific product, so the slide-over Cart Drawer opens immediately to confirm the addition and offer rapid access to review and checkout.
2. **Paise-Based Currency Math**: All monetary totals are calculated in integer paise (minor units) to prevent JavaScript floating-point rounding bugs before formatting to INR strings via `Intl.NumberFormat`.
3. **Normalized Cart Persistence**: The cart persists only `{ id, qty }` lines in `localStorage`. Titles, prices, and images are derived synchronously from the catalog to prevent price tampering or stale stored prices.
4. **Diacritic & Multi-Word Search**: Text search normalizes Unicode decomposing diacritics via `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")`, collapsing whitespace and matching all search terms across title, origin, and tasting notes.
5. **No Runtime Animation Libraries**: All animations and micro-interactions are written with native CSS keyframes, transitions, and the browser View Transitions API, keeping the production bundle lightweight without dependencies like Framer Motion.
