import type { Ref } from "react";
import { IconSearch, IconX } from "../common/Icons";

export interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  id?: string;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export function SearchBar({
  value,
  onChange,
  id = "search",
  placeholder = "Search beans, teas, gear",
  inputRef,
}: SearchBarProps) {
  return (
    <div role="search" className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <IconSearch
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
        width={18}
        height={18}
      />
      <input
        id={id}
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-10 text-sm outline-none transition placeholder:text-mute focus:border-accent focus:ring-2 focus:ring-accent/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-mute hover:bg-sunk hover:text-ink"
        >
          <IconX width={16} height={16} />
        </button>
      )}
    </div>
  );
}
