import { IconCheck } from "../common/Icons";

export interface ParcelContentsProps {
  items: string[];
}

export function ParcelContents({ items }: ParcelContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-lg border border-line bg-card/70 p-3.5 text-sm text-ink/90"
        >
          <span
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft/50 text-accent"
            aria-hidden="true"
          >
            <IconCheck width={13} height={13} />
          </span>
          <span className="leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}
