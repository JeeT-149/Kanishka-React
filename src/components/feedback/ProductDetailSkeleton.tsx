export function ProductDetailSkeleton() {
  return (
    <div
      className="mx-auto grid max-w-[1280px] gap-10 px-5 py-8 md:grid-cols-2 md:gap-16 md:px-8"
      aria-busy="true"
      aria-label="Loading product details"
    >
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
