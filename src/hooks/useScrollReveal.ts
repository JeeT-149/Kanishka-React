import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — IntersectionObserver hook for subtle on-scroll element reveals.
 *
 * Rules:
 *   - Fires once per element.
 *   - Respects prefers-reduced-motion (reveals immediately without animation).
 *   - Animates opacity and translateY only.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasObserver = "IntersectionObserver" in window;
    return prefersReduced || !hasObserver;
  });

  useEffect(() => {
    if (isRevealed) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isRevealed]);

  return { ref, isRevealed };
}
