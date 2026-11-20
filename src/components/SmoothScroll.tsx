"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Previously wrapped the page in Lenis, a JS library that intercepts wheel/
 * touch input and drives scroll itself (via `window.scrollTo` on a rAF
 * loop) to get an eased, "weighted" scroll feel, synced to GSAP's ticker so
 * ScrollTrigger-driven parallax (Hero's layered background, etc.) stayed in
 * step with it.
 *
 * Removed: real-world testing on this client's own machine (Safari/
 * Firefox, desktop) showed persistent scroll *and* cursor lag that never
 * showed up in this project's Chromium-based QA — a known gap for this
 * category of library, since replacing the browser's native, compositor-
 * accelerated scrolling with a JS-driven one removes exactly the fast path
 * those engines rely on, and they don't all optimize the replacement as
 * well as Chromium does. Hero's ScrollTrigger-based parallax doesn't
 * actually depend on this component at all (see src/lib/useGSAP.ts — it
 * registers ScrollTrigger and reads scroll position itself); without
 * Lenis in the way, ScrollTrigger just reads native scroll directly, which
 * is its default mode and the one it's built around.
 *
 * All that's left here is making anchor-link clicks (nav, footer, hero
 * CTAs) glide instead of jump, via the browser's own native smooth
 * scrolling — no JS-driven re-render of scroll position every frame, so
 * nothing here can itself become a source of jank in any engine.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a[href^='#'], a[href^='/#']");
      if (!target) return;
      const href = target.getAttribute("href") ?? "";
      const id = href.split("#")[1];
      if (!id) return;
      const dest = document.getElementById(id);
      if (!dest) return;
      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
