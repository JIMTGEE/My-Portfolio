"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Runs a GSAP setup callback scoped to `scopeRef`, with ScrollTrigger
 * registered once. No-ops under prefers-reduced-motion, and always cleans
 * up its own tweens/triggers on unmount via gsap.context().
 */
export function useGSAP(
  scopeRef: RefObject<HTMLElement>,
  setup: (g: typeof gsap, st: typeof ScrollTrigger) => void
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => setup(gsap, ScrollTrigger), scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
