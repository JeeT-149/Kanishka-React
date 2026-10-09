import type { AllergenInfoData } from "../../types/product";

export interface AllergenInfoProps {
  allergens?: AllergenInfoData;
}

export function AllergenInfo({ allergens }: AllergenInfoProps) {
  if (!allergens) return null;

  const hasContains = allergens.contains && allergens.contains.length > 0;
  const hasMayContain = allergens.mayContain && allergens.mayContain.length > 0;

  return (
    <div className="space-y-4">
      {hasContains ? (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Contains:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {allergens.contains.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft/30 px-3 py-1 text-xs font-medium text-accent-deep"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink">
            No major allergens
          </span>
        </div>
      )}

      {hasMayContain && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-mute">
            May contain:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {allergens.mayContain.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-line bg-card px-2.5 py-0.5 text-xs text-mute"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {allergens.note && (
        <p className="text-xs leading-relaxed text-mute">{allergens.note}</p>
      )}
    </div>
  );
}
