"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe replacement for Framer Motion's own `useReducedMotion()`.
 *
 * Framer's hook reads `window.matchMedia("(prefers-reduced-motion: reduce)")`
 * synchronously on first render (not inside an effect), so on a visitor who
 * has the OS/browser preference enabled, the client's very first render
 * already returns `true` while the server — which has no `window` — rendered
 * assuming `false`. That mismatch lands squarely inside hydration, where
 * server and client markup must agree, and React logs a prop-mismatch
 * warning for every `motion` element gated on it (RevealOnScroll, Journey's
 * timeline items).
 *
 * Same fix as `useMotionCapability`: start `false` on the server and on the
 * first client render (so hydration always agrees), then read the real
 * value after mount. A reduced-motion visitor sees one initial frame of the
 * default (animated) `initial` state before it flips — same trade-off this
 * codebase already makes elsewhere, and far better than a console error on
 * every load.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
