"use client";

import type { RefObject } from "react";
import { useGSAP } from "./useGSAP";

/**
 * Wires every `[data-speed]` child of `scopeRef` into a GSAP ScrollTrigger
 * scrub parallax — each layer drifts vertically by `speed * 100`% as its
 * container crosses the viewport. This is the exact technique Hero's
 * background field originated; pulled out here so every other section that
 * wants the same "dynamic, consistent" ambient motion (see AmbientField)
 * shares one implementation instead of hand-rolling a copy per section.
 *
 * No-ops under prefers-reduced-motion / narrow viewports via useGSAP's own
 * gating — callers don't need to check capability themselves.
 */
export function useParallaxField(scopeRef: RefObject<HTMLElement>) {
  useGSAP(scopeRef, (gsap) => {
    const layers = scopeRef.current?.querySelectorAll<HTMLElement>("[data-speed]");
    if (!layers?.length) return;

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed ?? "0.2");
      gsap.to(layer, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });
  });
}
