"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 up to `target` once the element holding `ref`
 * scrolls into view, easing out rather than ticking linearly. Built for the
 * stats row in About.tsx — "verified statistics only" per the brief, so
 * this only ever animates a number already computed elsewhere (e.g.
 * `projects.length`); it never invents one.
 *
 * Fires once (IntersectionObserver disconnects after the first entry) and
 * jumps straight to `target` under prefers-reduced-motion or when `target`
 * isn't a finite number, so a stat like "3+" can still pass its numeric
 * part through safely.
 */
export function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) {
      setValue(target);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          setValue(Math.round(target * easeOutCubic(progress)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [target, duration]);

  return { ref, value };
}
