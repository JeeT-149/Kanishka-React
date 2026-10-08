import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { categoryLabel } from "../types/product";
import { getAllProducts } from "../services/productService";
import { money, toMinor, formatMinor } from "../lib/currency";
import { useCart } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useProduct } from "../hooks/useProduct";
import { IconArrow, IconBack, IconCheck, IconSearch, IconX, Img, ProductCard, Qty, Stars, StateBlock, btnGhost, btnPrimary } from "../ui";

export function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-8 md:grid-cols-2 md:gap-16 md:px-8" aria-busy="true" aria-label="Loading product">
      <div>
        <div className="skeleton aspect-[4/5] rounded-card" />
        <div className="mt-3 flex gap-3">
          <div className="skeleton size-20 rounded-lg" />
          <div className="skeleton size-20 rounded-lg" />
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <div className="skeleton h-3 w-40" />
        <div className="skeleton h-12 w-4/5" />
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-8 w-20" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-12 w-full rounded-ctl" />
      </div>
    </div>
  );
}

export default function Product() {
  const { id = "" } = useParams();
  const { product: p, status, retry } = useProduct(id);
  const nav = useNavigate();
  const { add } = useCart();
  const { openDrawer } = useCartDrawer();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setImg(0);
    setAdded(false);
  }, [id]);

  if (status === "loading") {
    return <ProductSkeleton />;
  }

  if (status === "error") {
    return (
      <StateBlock
        icon={<IconX width={28} height={28} />}
        title="We couldn't load this product"
        action={
          <button className={btnPrimary} onClick={retry}>
            Try again
          </button>
        }
      >
        Something went wrong while fetching product details. Check your connection and try again.
      </StateBlock>
    );
  }

  if (status === "not-found" || !p) {
    return (
      <StateBlock
        icon={<IconSearch width={28} height={28} />}
        title="We couldn't find that product"
        action={
          <Link to="/" className={btnPrimary}>
            Back to the shop
          </Link>
        }
      >
        The link may be out of date, or the product has sold out for good. Nothing at <code className="text-ink">/product/{id}</code>.
      </StateBlock>
    );
  }

  const gallery = p.images?.length ? p.images : [p.image];
  const isOutOfStock = p.inStock === false;
  const related = getAllProducts().filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const onAdd = () => {
    if (isOutOfStock) return;
    add(p.id, qty);
    setAdded(true);
  };

  const totalPriceText = formatMinor(toMinor(p.price) * qty);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-6 md:px-8 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-ink">Shop</Link></li>
            <li aria-hidden>/</li>
            <li><Link to={`/?cat=${p.category}`} className="hover:text-ink">{categoryLabel(p.category)}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="max-w-[40vw] truncate text-ink md:max-w-xs">{p.name}</li>
          </ol>
        </nav>
        <button onClick={() => nav(-1)} className="inline-flex min-h-11 items-center gap-1.5 hover:text-ink">
          <IconBack width={16} height={16} /> Back
        </button>
      </div>

      <div className="mt-4 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="rise md:sticky md:top-24 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sunk">
            <Img key={img} src={gallery[img] ?? gallery[0]} alt={`${p.name}, view ${img + 1}`} className="fade size-full object-cover" />
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
                  onClick={() => setImg(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === img}
                  className={`size-20 overflow-hidden rounded-lg border-2 transition ${i === img ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rise pt-2" style={{ animationDelay: "80ms" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-mute">{p.origin ?? categoryLabel(p.category)}</p>
          <h1 className="mt-3 font-display text-4xl font-light leading-[1.08] tracking-tight [overflow-wrap:anywhere] md:text-5xl">{p.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <Stars rating={p.rating} count={p.reviewCount} />
            {p.weight && <span className="text-sm text-mute">{p.weight}</span>}
          </div>
          <p className="mt-5 text-3xl font-medium tabular-nums text-ink">{money(p.price)}</p>
          {p.description && <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-mute">{p.description}</p>}

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <Row k="Origin" v={p.origin ?? "Blended in house"} />
            {p.roast && (
              <Row
                k="Roast"
                v={
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1" role="img" aria-label={`Roast level ${p.roast} of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`h-2 w-6 rounded-full ${n <= (p.roast ?? 0) ? "bg-accent" : "bg-line"}`} />
                      ))}
                    </span>
                    <span className="text-mute">{["Light", "Light-medium", "Medium", "Medium-dark", "Dark"][p.roast - 1]}</span>
                  </span>
                }
              />
            )}
            {p.tastingNotes && p.tastingNotes.length > 0 && (
              <Row
                k="Notes"
                v={
                  <ul className="flex flex-wrap gap-2">
                    {p.tastingNotes.map((n) => (
                      <li key={n} className="rounded-full border border-line bg-card px-3 py-1 text-xs">{n}</li>
                    ))}
                  </ul>
                }
              />
            )}
            {p.weight && <Row k="Weight" v={p.weight} />}
            <Row k="Brew" v={p.brewRecipe ?? "Recommendation coming soon"} muted={!p.brewRecipe} />
          </dl>

          <div className="mt-8 hidden items-center gap-4 md:flex">
            <Qty value={qty} onChange={setQty} label={p.name} />
            <button
              onClick={onAdd}
              disabled={isOutOfStock}
              className={`${btnPrimary} flex-1 ${isOutOfStock ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {isOutOfStock ? "Out of stock" : added ? <><IconCheck width={18} height={18} /> Added to cart ✓</> : `Add to cart · ${totalPriceText}`}
            </button>
          </div>
          <div aria-live="polite" className="mt-3 hidden min-h-6 text-sm md:block">
            {added && (
              <button onClick={openDrawer} className="fade inline-flex items-center gap-1.5 text-accent underline underline-offset-4">
                View cart <IconArrow width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-10" aria-labelledby="related">
          <h2 id="related" className="font-display text-3xl font-light">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((r, i) => (
              <ProductCard key={r.id} p={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky action bar with solid/blurred background */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-[#f7f4ee]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <Qty size="sm" value={qty} onChange={setQty} label={p.name} />
        <button
          onClick={added ? openDrawer : onAdd}
          disabled={isOutOfStock}
          className={`${btnPrimary} flex-1 ${isOutOfStock ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {isOutOfStock ? "Out of stock" : added ? <><IconCheck width={16} height={16} /> Added ✓</> : `Add · ${totalPriceText}`}
        </button>
      </div>
    </div>
  );
}

function Row({ k, v, muted }: { k: string; v: React.ReactNode; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-4 py-3.5">
      <dt className="text-mute">{k}</dt>
      <dd className={muted ? "italic text-mute" : ""}>{v}</dd>
    </div>
  );
}

export { btnGhost };
