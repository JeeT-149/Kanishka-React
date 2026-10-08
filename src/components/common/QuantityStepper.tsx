import { IconMinus, IconPlus } from "./Icons";
import { MAX_CART_QTY } from "../../context/cartStorage";

export interface QuantityStepperProps {
  value: number;
  onChange: (nextValue: number) => void;
  label: string;
  size?: "sm" | "md";
  max?: number;
}

export function QuantityStepper({
  value,
  onChange,
  label,
  size = "md",
  max = MAX_CART_QTY,
}: QuantityStepperProps) {
  const isMin = value <= 1;
  const isMax = value >= max;

  const buttonClass =
    "grid place-items-center transition hover:bg-sunk active:bg-line disabled:cursor-not-allowed disabled:text-mute/40 disabled:hover:bg-transparent " +
    (size === "sm"
      ? "size-9 min-h-[44px] min-w-[36px]"
      : "size-11 min-h-[44px] min-w-[44px]");

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div
        role="group"
        aria-label={`Quantity for ${label}`}
        className="inline-flex items-center rounded-ctl border border-ink/20 bg-card"
      >
        <button
          type="button"
          className={`${buttonClass} rounded-l-[7px]`}
          disabled={isMin}
          onClick={() => onChange(value - 1)}
          aria-label={`Decrease quantity of ${label}`}
        >
          <IconMinus width={16} height={16} />
        </button>
        <span
          key={value}
          aria-live="polite"
          className="num-feedback min-w-8 text-center text-sm font-medium tabular-nums"
        >
          {value}
        </span>
        <button
          type="button"
          className={`${buttonClass} rounded-r-[7px]`}
          disabled={isMax}
          onClick={() => onChange(value + 1)}
          aria-label={`Increase quantity of ${label}`}
        >
          <IconPlus width={16} height={16} />
        </button>
      </div>
      {isMax && (
        <span className="text-[11px] text-mute" role="status">
          Maximum 20 per order
        </span>
      )}
    </div>
  );
}
