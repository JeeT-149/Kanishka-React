import { SORT_OPTIONS } from "../../lib/productFilters";
import { IconChevronDown } from "../common/Icons";

export interface SortSelectProps {
  value: string;
  onChange: (sortValue: string) => void;
  id?: string;
  isMobile?: boolean;
}

export function SortSelect({
  value,
  onChange,
  id = "sort",
  isMobile = false,
}: SortSelectProps) {
  if (isMobile) {
    return (
      <div className="flex items-center gap-2 md:hidden">
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-mute"
        >
          Sort
        </label>
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-card pl-3 pr-8 text-xs font-medium text-ink outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-mute">
            <IconChevronDown />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden shrink-0 items-center gap-2.5 text-sm md:flex">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-mute"
      >
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 cursor-pointer appearance-none rounded-full border border-line bg-card pl-4 pr-10 text-sm font-medium text-ink outline-none transition hover:border-ink/40 focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mute">
          <IconChevronDown />
        </div>
      </div>
    </div>
  );
}
