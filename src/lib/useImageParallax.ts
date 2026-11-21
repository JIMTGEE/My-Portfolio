"use client";

import type { RefObject } from "react";
import { useGSAP } from "./useGSAP";

/**
 * Subtle vertical image drift as a card scrolls through the viewport — the
 * brief's "image parallax" for project cards, layered on top of useTilt's
 * cursor-driven 3D tilt rather than duplicating it. Pass the card's outer
 * ref; it finds the element tagged `data-parallax-img` inside automatically,
 * so callers don't need a second ref just for the image.
 *
 * The image itself must render taller than its frame (see ProjectCard's
 * `h-[114%]`) so a ±6% vertical shift never uncovers empty space at an edge.
 * Gated by useGSAP's own reduced-motion/narrow-viewport check, same as
 * every other scroll effect on the page.
 */
export function useImageParallax<T extends HTMLElement>(scopeRef: RefObject<T>) {
  useGSAP(scopeRef as unknown as RefObject<HTMLElement>, (gsap) => {
    const img = scopeRef.current?.querySelector<HTMLElement>("[data-parallax-img]");
    if (!img) return;

    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      }
    );
  });
}
