"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Runs a GSAP setup callback scoped to `scopeRef`, with ScrollTrigger
 * registered once. No-ops under prefers-reduced-motion or on narrow/
 * touch-only viewports — same "capable" threshold as
 * useMotionCapability, applied here too so a scroll-scrubbed parallax
 * tween doesn't attach a ScrollTrigger listener on a low-powered phone
 * (the brief calls for parallax to be reduced/disabled there). Always
 * cleans up its own tweens/triggers on unmount via gsap.context().
 */
export function useGSAP(
  scopeRef: RefObject<HTMLElement>,
  setup: (g: typeof gsap, st: typeof ScrollTrigger) => void
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = !window.matchMedia("(min-width: 768px)").matches;
    if (reduced || narrow) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => setup(gsap, ScrollTrigger), scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
