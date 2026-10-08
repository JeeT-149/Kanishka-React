import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { filterAndSortProducts } from "../lib/productFilters";
import { CategoryPills } from "../components/product/CategoryPills";
import { SortSelect } from "../components/product/SortSelect";
import { ProductGrid } from "../components/product/ProductGrid";
import { ProductGridSkeleton } from "../components/feedback/ProductGridSkeleton";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorState } from "../components/feedback/ErrorState";
import { IconArrow, IconSearch, IconX } from "../components/common/Icons";
import { btnPrimary } from "../lib/styles";
import { CATEGORIES, type Category } from "../types/product";

export default function Home() {
  useDocumentTitle("Artisanal Coffee & Rare-Leaf Teas");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = (params.get("cat") ?? "all") as Category | "all";
  const sort = params.get("sort") ?? "featured";
  const { products, status, retry } = useProducts();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () => filterAndSortProducts(products, q, cat, sort),
    [products, q, cat, sort],
  );

  const isFiltered = Boolean(q || cat !== "all");

  const clearFilters = () => {
    const next = new URLSearchParams(params);
    next.delete("q");
    next.delete("cat");
    setParams(next, { replace: true });
  };

  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label;

  return (
    <>
      <section className="mx-auto grid max-w-[1280px] gap-6 px-5 pb-5 pt-6 md:grid-cols-[1.3fr_1fr] md:items-end md:px-8 md:pb-7 md:pt-8">
        <h1 className="rise font-display text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl md:text-[54px] lg:text-[62px]">
          Roasted slowly.
          <br />
          <span className="italic text-accent">Steeped</span> with care.
        </h1>
        <div
          className="rise max-w-sm md:justify-self-end"
          style={{ animationDelay: "120ms" }}
        >
          <p className="text-sm leading-relaxed text-mute">
            Small-batch coffee and rare-leaf tea from growers we know by name, roasted
            every Tuesday and Friday.
          </p>
          <a href="#shop" className={`${btnPrimary} mt-4`}>
            Shop the roastery <IconArrow width={16} height={16} />
          </a>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 md:px-8">
        <div className="sticky top-16 z-30 border-y border-line bg-[#f7f4ee] py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            <CategoryPills
              activeCategory={cat}
              onSelectCategory={(nextCat) =>
                setParam("cat", nextCat === "all" ? null : nextCat)
              }
            />
            <SortSelect
              value={sort}
              onChange={(nextSort) =>
                setParam("sort", nextSort === "featured" ? null : nextSort)
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-4 text-sm text-mute">
          <p role="status" className="font-medium">
            {status !== "success"
              ? "\u00A0"
              : `${results.length} ${results.length === 1 ? "product" : "products"}`}
          </p>
          <div className="flex items-center gap-4">
            <SortSelect
              value={sort}
              onChange={(nextSort) =>
                setParam("sort", nextSort === "featured" ? null : nextSort)
              }
              id="sort-m"
              isMobile
            />
            {isFiltered && status === "success" && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-ink underline underline-offset-4 hover:text-accent"
              >
                <IconX width={14} height={14} /> Clear filters
              </button>
            )}
          </div>
        </div>

        {status === "loading" && <ProductGridSkeleton />}

        {status === "error" && <ErrorState onRetry={retry} />}

        {status === "success" && results.length === 0 && (
          <EmptyState
            title="No products match your search"
            icon={<IconSearch width={28} height={28} />}
            message={
              <>
                <p>
                  {q && (
                    <>
                      Query: <strong className="font-medium text-ink">“{q}”</strong>
                    </>
                  )}
                  {q && cat !== "all" && " · "}
                  {cat !== "all" && (
                    <>
                      Category:{" "}
                      <strong className="font-medium text-ink">{catLabel}</strong>
                    </>
                  )}
                </p>
                <p className="mt-2">
                  Try a different spelling, or browse everything we roast.
                </p>
              </>
            }
            action={
              <button type="button" className={btnPrimary} onClick={clearFilters}>
                Clear filters
              </button>
            }
          />
        )}

        {status === "success" && results.length > 0 && <ProductGrid products={results} />}
      </section>
    </>
  );
}
