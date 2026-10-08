import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { categoryLabel } from "../types/product";
import { money, toMinor, formatMinor } from "../lib/currency";
import { useCart } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useProduct } from "../hooks/useProduct";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SafeImage } from "../components/common/SafeImage";
import { StarRating } from "../components/common/StarRating";
import { QuantityStepper } from "../components/common/QuantityStepper";
import { RoastMeter } from "../components/product/RoastMeter";
import { RelatedProducts } from "../components/product/RelatedProducts";
import { ProductDetailSkeleton } from "../components/feedback/ProductDetailSkeleton";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorState } from "../components/feedback/ErrorState";
import { IconArrow, IconBack, IconCheck, IconSearch } from "../components/common/Icons";
import { btnPrimary } from "../lib/styles";

export default function ProductDetail() {
  const { id = "" } = useParams();
  const { product, status, retry } = useProduct(id);
  const navigate = useNavigate();
  const { add } = useCart();
  const { openDrawer } = useCartDrawer();
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useDocumentTitle(
    product ? product.name : status === "not-found" ? "Product Not Found" : "Loading Product",
  );

  useEffect(() => {
    setQty(1);
    setActiveImageIndex(0);
    setIsAdded(false);
  }, [id]);

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

  const handleAdd = () => {
    if (isOutOfStock) return;
    add(product.id, qty);
    setIsAdded(true);
  };

  const totalPriceText = formatMinor(toMinor(product.price) * qty);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-6 md:px-8 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/?cat=${product.category}`} className="hover:text-ink">
                {categoryLabel(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              aria-current="page"
              className="max-w-[40vw] truncate text-ink md:max-w-xs"
            >
              {product.name}
            </li>
          </ol>
        </nav>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-11 items-center gap-1.5 hover:text-ink"
        >
          <IconBack width={16} height={16} /> Back
        </button>
      </div>

      <div className="mt-4 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="rise md:sticky md:top-24 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sunk">
            <SafeImage
              key={activeImageIndex}
              src={gallery[activeImageIndex] ?? gallery[0]}
              alt={`${product.name}, view ${activeImageIndex + 1}`}
              className="fade size-full object-cover"
            />
            {isOutOfStock && (
              <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-paper">
                Sold out
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === activeImageIndex}
                  className={`size-20 overflow-hidden rounded-lg border-2 transition ${
                    i === activeImageIndex
                      ? "border-accent"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <SafeImage src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rise pt-2" style={{ animationDelay: "80ms" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-mute">
            {product.origin ?? categoryLabel(product.category)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-light leading-[1.08] tracking-tight [overflow-wrap:anywhere] md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <StarRating rating={product.rating} count={product.reviewCount} />
            {product.weight && <span className="text-sm text-mute">{product.weight}</span>}
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
                    {product.tastingNotes.map((note) => (
                      <li
                        key={note}
                        className="rounded-full border border-line bg-card px-3 py-1 text-xs"
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

          <div className="mt-8 hidden items-center gap-4 md:flex">
            <QuantityStepper value={qty} onChange={setQty} label={product.name} />
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`${btnPrimary} flex-1 ${
                isOutOfStock ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {isOutOfStock ? (
                "Out of stock"
              ) : isAdded ? (
                <>
                  <IconCheck width={18} height={18} /> Added to cart ✓
                </>
              ) : (
                `Add to cart · ${totalPriceText}`
              )}
            </button>
          </div>
          <div aria-live="polite" className="mt-3 hidden min-h-6 text-sm md:block">
            {isAdded && (
              <button
                type="button"
                onClick={openDrawer}
                className="fade inline-flex items-center gap-1.5 text-accent underline underline-offset-4"
              >
                View cart <IconArrow width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <RelatedProducts currentProduct={product} />

      {/* Mobile sticky action bar with solid/blurred background */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-[#f7f4ee]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <QuantityStepper
          size="sm"
          value={qty}
          onChange={setQty}
          label={product.name}
        />
        <button
          type="button"
          onClick={isAdded ? openDrawer : handleAdd}
          disabled={isOutOfStock}
          className={`${btnPrimary} flex-1 ${
            isOutOfStock ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {isOutOfStock ? (
            "Out of stock"
          ) : isAdded ? (
            <>
              <IconCheck width={16} height={16} /> Added ✓
            </>
          ) : (
            `Add · ${totalPriceText}`
          )}
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
