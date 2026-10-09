import type { ProductDetailItem } from "../../types/product";

export interface ProductAboutProps {
  about: string;
  details: ProductDetailItem[];
}

export function ProductAbout({ about, details }: ProductAboutProps) {
  return (
    <div className="space-y-6">
      <p className="max-w-prose text-[15px] leading-relaxed text-ink/90 sm:text-base">
        {about}
      </p>

      {details.length > 0 && (
        <dl className="divide-y divide-line border-y border-line text-sm">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-[140px_1fr] items-center gap-4 py-3 sm:grid-cols-[180px_1fr]"
            >
              <dt className="text-mute font-medium">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
