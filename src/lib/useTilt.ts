"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Subtle 3D tilt-on-hover: rotates the element around X/Y based on cursor
 * position within its bounds (±max degrees), plus a CSS custom property
 * (--glare-x/--glare-y, 0–100) a consumer can use for a cursor-following
 * sheen. Resets smoothly on leave. No-ops when `enabled` is false.
 */
export function useTilt<T extends HTMLElement>(
  enabled: boolean,
  max = 7
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rotateY = (px - 0.5) * max * 2;
        const rotateX = (0.5 - py) * max * 2;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        el.style.setProperty("--glare-x", `${px * 100}%`);
        el.style.setProperty("--glare-y", `${py * 100}%`);
        el.style.setProperty("--glare-o", "1");
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      el.style.setProperty("--glare-o", "0");
    };

    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [enabled, max]);

  return ref;
}
