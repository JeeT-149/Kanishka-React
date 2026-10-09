import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { categoryLabel } from "../types/product";
import { money } from "../lib/currency";
import { useCart } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useProduct } from "../hooks/useProduct";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SafeImage } from "../components/common/SafeImage";
import { StarRating } from "../components/common/StarRating";
import { RoastMeter } from "../components/product/RoastMeter";
import { RelatedProducts } from "../components/product/RelatedProducts";
import { ProductDetailSkeleton } from "../components/feedback/ProductDetailSkeleton";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorState } from "../components/feedback/ErrorState";
import { IconBack, IconCheck, IconSearch } from "../components/common/Icons";
import { ReassuranceRows } from "../components/product/ReassuranceRows";
import { btnPrimary, getCategoryTileBg, getProductAlt } from "../lib/styles";

export default function ProductDetail() {
  const { id = "" } = useParams();
  const { product, status, retry } = useProduct(id);
  const navigate = useNavigate();
  const { add, lines } = useCart();
  const { openDrawer } = useCartDrawer();
  const [prevId, setPrevId] = useState(id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Synchronously reset form state when route id changes
  if (prevId !== id) {
    setPrevId(id);
    setActiveImageIndex(0);
    setIsAdded(false);
  }

  useDocumentTitle(
    product
      ? product.name
      : status === "not-found"
        ? "Product Not Found"
        : "Loading Product",
  );

  if (status === "loading") {
    return <ProductDetailSkeleton />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="We couldn't load this product"
        message="Something went wrong while fetching product details. Check your connection and try again."
        onRetry={retry}
      />
    );
  }

  if (status === "not-found" || !product) {
    return (
      <EmptyState
        icon={<IconSearch width={28} height={28} />}
        title="We couldn't find that product"
        message={
          <>
            The link may be out of date, or the product has sold out for good. Nothing at{" "}
            <code className="text-ink">/product/{id}</code>.
          </>
        }
        action={
          <Link to="/" className={btnPrimary}>
            Back to the shop
          </Link>
        }
      />
    );
  }

  const gallery = product.images?.length ? product.images : [product.image];
  const isOutOfStock = product.inStock === false;
  const currentLine = lines.find((line) => line.id === product.id);
  const isMaxInCart = (currentLine?.qty ?? 0) >= 20;

  const handleBack = () => {
    if (
      typeof window !== "undefined" &&
      window.history.state &&
      typeof window.history.state.idx === "number" &&
      window.history.state.idx > 0
    ) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleAdd = () => {
    if (isOutOfStock || isMaxInCart) return;
    add(product.id, 1);
    setIsAdded(true);
    openDrawer(product.id);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-6 md:px-8 md:pb-12">
      {/* Top bar: compact Back control and breadcrumb in a single row */}
      <div className="flex items-center gap-3 text-sm text-mute">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="inline-flex shrink-0 items-center gap-1.5 py-1 text-mute transition hover:text-ink focus-visible:outline-2"
        >
          <IconBack width={16} height={16} /> Back
        </button>
        <span className="text-line select-none" aria-hidden="true">
          ·
        </span>
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center gap-2 truncate">
            <li className="shrink-0">
              <Link to="/" className="hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden="true" className="shrink-0 text-mute/50">
              /
            </li>
            <li className="shrink-0">
              <Link to={`/?cat=${product.category}`} className="hover:text-ink">
                {categoryLabel(product.category)}
              </Link>
            </li>
            <li aria-hidden="true" className="shrink-0 text-mute/50">
              /
            </li>
            <li
              aria-current="page"
              className="truncate text-ink"
            >
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="mt-4 grid gap-10 md:grid-cols-2 md:gap-16">
        {/* Left column: product image tile and thumbnails */}
        <div className="rise">
          {(() => {
            const currentImg = gallery[activeImageIndex] ?? gallery[0];
            const isCurrentSvg = currentImg?.endsWith(".svg");
            return (
              <div
                className={`relative aspect-[4/5] max-h-[80svh] overflow-hidden rounded-card ${
                  isCurrentSvg
                    ? `${getCategoryTileBg(product.category, product.artKind)} flex items-center justify-center p-6 md:p-8`
                    : "bg-sunk"
                }`}
              >
                <SafeImage
                  key={activeImageIndex}
                  src={currentImg}
                  alt={
                    activeImageIndex === 0
                      ? getProductAlt(product)
                      : `${product.name} tasting and cupping notes archive card`
                  }
                  style={{
                    viewTransitionName: activeImageIndex === 0 ? "product-image" : "none",
                  }}
                  className={`fade size-full ${isCurrentSvg ? "object-contain" : "object-cover"}`}
                />
                {isOutOfStock && (
                  <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-paper">
                    Sold out
                  </span>
                )}
              </div>
            );
          })()}
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3">
              {gallery.map((src, i) => {
                const isThumbSvg = src.endsWith(".svg");
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={
                      i === 0
                        ? `Show packaging for ${product.name}`
                        : `Show detail view for ${product.name}`
                    }
                    aria-current={i === activeImageIndex}
                    className={`size-20 overflow-hidden rounded-lg border-2 focus-visible:outline-2 focus-visible:outline-accent ${
                      isThumbSvg
                        ? `${getCategoryTileBg(product.category, product.artKind)} p-1.5`
                        : "bg-sunk p-0"
                    } transition ${
                      i === activeImageIndex
                        ? "border-accent ring-1 ring-accent"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <SafeImage
                      src={src}
                      alt=""
                      className={`size-full ${isThumbSvg ? "object-contain" : "object-cover"}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: info & sticky buy box */}
        <div className="rise pt-2 md:sticky md:top-24 md:self-start" style={{ animationDelay: "80ms" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-mute">
            {product.origin ?? categoryLabel(product.category)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-light leading-[1.08] tracking-tight [overflow-wrap:anywhere] md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <StarRating rating={product.rating} count={product.reviewCount} />
            {product.weight && (
              <span className="text-sm text-mute">{product.weight}</span>
            )}
          </div>
          <p className="mt-5 text-3xl font-medium tabular-nums text-ink">
            {money(product.price)}
          </p>
          {product.description && (
            <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-mute">
              {product.description}
            </p>
          )}

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <Row label="Origin" value={product.origin ?? "Blended in house"} />
            {product.roast && (
              <Row label="Roast" value={<RoastMeter level={product.roast} />} />
            )}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <Row
                label="Notes"
                value={
                  <ul className="flex flex-wrap gap-2">
                    {product.tastingNotes.map((note, i) => (
                      <li
                        key={note}
                        style={{ animationDelay: `${i * 50 + 100}ms` }}
                        className="fade rounded-full border border-line bg-card px-3 py-1 text-xs"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                }
              />
            )}
            {product.weight && <Row label="Weight" value={product.weight} />}
            <Row
              label="Brew"
              value={product.brewRecipe ?? "Recommendation coming soon"}
              muted={!product.brewRecipe}
            />
          </dl>

          <div className="mt-8 hidden items-center md:flex">
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock || isMaxInCart}
              className={`${btnPrimary} w-full ${
                isOutOfStock || isMaxInCart ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <span className="inline-flex items-center gap-2" aria-live="polite">
                {isOutOfStock ? (
                  "Out of stock"
                ) : isMaxInCart ? (
                  "Maximum in cart"
                ) : isAdded ? (
                  <>
                    <IconCheck width={18} height={18} /> Added to cart ✓
                  </>
                ) : (
                  `Add to cart · ${money(product.price)}`
                )}
              </span>
            </button>
          </div>

          <ReassuranceRows category={product.category} />
        </div>
      </div>

      <RelatedProducts currentProduct={product} />

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-line bg-[#f7f4ee] px-4 py-3 shadow-md md:hidden">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock || isMaxInCart}
          className={`${btnPrimary} w-full ${
            isOutOfStock || isMaxInCart ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <span className="inline-flex items-center gap-2" aria-live="polite">
            {isOutOfStock ? (
              "Out of stock"
            ) : isMaxInCart ? (
              "Maximum in cart"
            ) : isAdded ? (
              <>
                <IconCheck width={16} height={16} /> Added ✓
              </>
            ) : (
              `Add to cart · ${money(product.price)}`
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-4 py-3.5">
      <dt className="text-mute">{label}</dt>
      <dd className={muted ? "italic text-mute" : ""}>{value}</dd>
    </div>
  );
}
