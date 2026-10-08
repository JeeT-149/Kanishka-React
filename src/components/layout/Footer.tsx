import { Link } from "react-router";
import { Logo } from "../common/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-mute">
            Small-batch coffee and tea, roasted and blended in Bengaluru since 2016.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {[
            ["Shop", "/"],
            ["Cart", "/cart"],
            ["Shipping & returns", "/nope-shipping"],
            ["Contact", "/nope-contact"],
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className="flex min-h-8 items-center text-mute hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-[1280px] border-t border-line px-5 py-5 text-xs text-mute md:px-8">
        © 2026 Kiln &amp; Leaf Roasters Ltd. A fictional shop for design showcase purposes.
      </div>
    </footer>
  );
}
