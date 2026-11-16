"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Magnetic hover: the element eases toward the cursor within `radius`px of
 * its center, then springs back on leave. A small, tasteful version of the
 * effect used on primary CTAs across high-end interactive studio sites
 * (Active Theory, Lusion) — applied here only to the one or two buttons per
 * page that deserve the emphasis, not globally.
 *
 * No-ops entirely when `enabled` is false (reduced motion / touch / narrow
 * viewport, decided by the caller via useMotionCapability) — the element
 * just behaves like a normal button.
 */
export function useMagnetic<T extends HTMLElement>(
  enabled: boolean,
  strength = 0.35,
  radius = 80
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (dist < radius) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        } else {
          el.style.transform = "translate(0px, 0px)";
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.transform = "translate(0px, 0px)";
    };

    el.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [enabled, strength, radius]);

  return ref;
}
