import { useLayoutEffect, useRef } from "react";

/**
 * useFlipGrid — FLIP (First, Last, Invert, Play) animation for a grid of cards.
 *
 * Only runs when `sortKey` changes (not on filter/search changes — caller
 * passes a separate `entranceKey` for those, handled by the card-entrance CSS).
 *
 * Rules:
 *   - Animates transform only (no layout shift).
 *   - Skips the first render (no previous positions to FLIP from).
 *   - Caps at ~16 cards near / in the viewport.
 *   - Cancels cleanly when sortKey changes rapidly (previous animations abort).
 *   - Skipped entirely under prefers-reduced-motion.
 */
export function useFlipGrid<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  sortKey: string,
) {
  // Previous positions keyed by the card's data-id attribute
  const prevPositions = useRef<Map<string, DOMRect>>(new Map());
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip on the very first render (no "before" snapshot yet)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Snapshot current positions for the next sort
      const cards = container.querySelectorAll<HTMLElement>("[data-flip-id]");
      cards.forEach((card) => {
        const id = card.getAttribute("data-flip-id");
        if (id) prevPositions.current.set(id, card.getBoundingClientRect());
      });
      return;
    }

    // Skip under reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Still snapshot for the next sort
      const cards = container.querySelectorAll<HTMLElement>("[data-flip-id]");
      cards.forEach((card) => {
        const id = card.getAttribute("data-flip-id");
        if (id) prevPositions.current.set(id, card.getBoundingClientRect());
      });
      return;
    }

    const cards = container.querySelectorAll<HTMLElement>("[data-flip-id]");
    const viewportHeight = window.innerHeight;

    // Collect new positions and compute delta from previous positions
    const toAnimate: { card: HTMLElement; dx: number; dy: number }[] = [];
    cards.forEach((card) => {
      const id = card.getAttribute("data-flip-id");
      if (!id) return;
      const newRect = card.getBoundingClientRect();
      const oldRect = prevPositions.current.get(id);
      if (!oldRect) return;
      // Only animate cards within or near the viewport (cap at 16 visible)
      const inViewport =
        newRect.bottom >= -newRect.height && newRect.top <= viewportHeight + newRect.height;
      if (!inViewport) return;
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        toAnimate.push({ card, dx, dy });
      }
    });

    // Cap at 16
    const capped = toAnimate.slice(0, 16);

    // Cancel any in-flight animations on these elements
    capped.forEach(({ card }) => {
      card.getAnimations().forEach((anim) => anim.cancel());
    });

    // Play FLIP animations
    capped.forEach(({ card, dx, dy }) => {
      card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "none",
        },
      );
    });

    // Snapshot new positions for the next change
    cards.forEach((card) => {
      const id = card.getAttribute("data-flip-id");
      if (id) prevPositions.current.set(id, card.getBoundingClientRect());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey]);
}
