import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { Logo } from "../common/Logo";
import { SearchBar } from "../product/SearchBar";
import { IconBag, IconSearch, IconX } from "../common/Icons";

export function Navbar() {
  const { count } = useCart();
  const { openDrawer } = useCartDrawer();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const onHome = location.pathname === "/";
  const query = onHome ? (params.get("q") ?? "") : "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearchChange = (newVal: string) => {
    if (onHome) {
      const nextParams = new URLSearchParams(params);
      if (newVal) {
        nextParams.set("q", newVal);
      } else {
        nextParams.delete("q");
      }
      setParams(nextParams, { replace: true });
    } else if (newVal) {
      navigate(`/?q=${encodeURIComponent(newVal)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#f7f4ee]/95 backdrop-blur-md transition-all duration-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div
        className={`mx-auto flex ${
          isScrolled ? "h-16" : "h-16 md:h-20"
        } max-w-[1280px] items-center gap-4 px-5 transition-[height] duration-200 md:px-8`}
      >
        <Logo className="md:w-48" />

        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchBar value={query} onChange={handleSearchChange} id="search-desktop" />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:w-48 md:justify-end">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-sunk md:hidden"
            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isMobileSearchOpen}
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
          >
            {isMobileSearchOpen ? <IconX /> : <IconSearch />}
          </button>

          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative grid size-11 place-items-center rounded-full hover:bg-sunk"
          >
            <IconBag />
            {count > 0 && (
              <span
                key={count}
                className="pop absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-[18px] text-white"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="fade border-t border-line px-5 py-3 md:hidden">
          <SearchBar
            value={query}
            onChange={handleSearchChange}
            id="search-mobile"
            inputRef={mobileInputRef}
          />
        </div>
      )}
    </header>
  );
}
