import { Link } from "react-router";

export interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/" aria-label="Kiln & Leaf, home" className={`flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-ink font-display text-sm text-paper">
        K
      </span>
      <span className="font-display text-xl tracking-tight">
        Kiln <span className="italic text-accent">&amp;</span> Leaf
      </span>
    </Link>
  );
}
