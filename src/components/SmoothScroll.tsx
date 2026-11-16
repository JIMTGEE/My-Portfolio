"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Wraps the page in Lenis smooth scrolling, synced to GSAP's ticker so every
 * existing ScrollTrigger-driven parallax (Hero's layered background, etc.)
 * stays perfectly in step with the smoothed scroll position instead of the
 * raw one.
 *
 * Skipped under prefers-reduced-motion (the correct reduced-motion
 * experience is native, non-decoupled scroll) and on touch/narrow
 * viewports — the brief calls for parallax to be reduced or disabled on
 * low-powered mobile, and a synthetic easing curve layered on top of a
 * touchscreen's own momentum scrolling fights it rather than helping, on
 * top of the real CPU cost of keeping a rAF loop and GSAP ticker running.
 * Native scroll (plus the CSS `scroll-behavior: smooth` fallback in
 * globals.css for anchor links) is the better mobile experience, not a
 * downgrade.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOnly = !window.matchMedia("(pointer: fine)").matches;
    const narrow = !window.matchMedia("(min-width: 768px)").matches;
    if (reduced || touchOnly || narrow) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor-link clicks (nav, footer "back to top", hero CTAs) should still
    // glide via Lenis rather than jump via native scroll-behavior.
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a[href^='#'], a[href^='/#']");
      if (!target) return;
      const href = target.getAttribute("href") ?? "";
      const id = href.split("#")[1];
      if (!id) return;
      const dest = document.getElementById(id);
      if (!dest) return;
      e.preventDefault();
      lenis.scrollTo(dest, { offset: -72, duration: 1.2 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
