import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useDebounce } from "../../hooks/useDebounce";
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
  const urlQuery = onHome ? (params.get("q") ?? "") : "";

  // Local state for immediate typing feedback
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Sync local input with URL when updated externally (clear filters, back/forward)
  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchTerm(urlQuery);
  }

  // Update URL search params after debounce delay
  useEffect(() => {
    if (!onHome) return;
    if (debouncedSearch === urlQuery) return;

    const nextParams = new URLSearchParams(params);
    if (debouncedSearch) {
      nextParams.set("q", debouncedSearch);
    } else {
      nextParams.delete("q");
    }
    setParams(nextParams, { replace: true });
  }, [debouncedSearch, onHome, params, setParams, urlQuery]);

  const handleSearchChange = (newVal: string) => {
    setSearchTerm(newVal);
    if (!onHome && newVal) {
      navigate(`/?q=${encodeURIComponent(newVal)}`);
    } else if (onHome && newVal === "") {
      // Immediate reset on clear button click
      const nextParams = new URLSearchParams(params);
      nextParams.delete("q");
      setParams(nextParams, { replace: true });
    }
  };

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

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-[#f7f4ee] transition-all duration-200"
      style={{ viewTransitionName: "main-navbar" }}
    >
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
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            id="search-desktop"
          />
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
            onClick={() => openDrawer()}
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
            value={searchTerm}
            onChange={handleSearchChange}
            id="search-mobile"
            inputRef={mobileInputRef}
          />
        </div>
      )}
    </header>
  );
}
