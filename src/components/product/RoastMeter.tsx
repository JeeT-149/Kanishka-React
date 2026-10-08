import type { RoastLevel } from "../../types/product";

export interface RoastMeterProps {
  level: RoastLevel;
}

const ROAST_LABELS: Record<RoastLevel, string> = {
  1: "Light",
  2: "Light-medium",
  3: "Medium",
  4: "Medium-dark",
  5: "Dark",
};

export function RoastMeter({ level }: RoastMeterProps) {
  return (
    <span className="flex items-center gap-3">
      <span
        className="flex gap-1"
        role="img"
        aria-label={`Roast level ${level} of 5`}
      >
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <span
            key={n}
            className={`h-2 w-6 rounded-full ${
              n <= level ? "bg-accent" : "bg-line"
            }`}
          />
        ))}
      </span>
      <span className="text-mute">{ROAST_LABELS[level]}</span>
    </span>
  );
}
