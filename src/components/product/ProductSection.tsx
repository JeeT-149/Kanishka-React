import { useScrollReveal } from "../../hooks/useScrollReveal";

export interface ProductSectionProps {
  id?: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProductSection({
  id,
  title,
  kicker,
  children,
  className = "",
}: ProductSectionProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={`
        scroll-mt-28 border-t border-line py-12 md:py-16
        transition-[opacity,transform] duration-500 ease-out
        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        ${className}
      `}
    >
      <div className="grid gap-6 md:grid-cols-[280px_1fr] md:gap-12">
        <div>
          {kicker && (
            <p className="text-xs uppercase tracking-[0.14em] text-mute mb-1">
              {kicker}
            </p>
          )}
          <h2 className="font-display text-2xl font-light tracking-tight text-ink md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
