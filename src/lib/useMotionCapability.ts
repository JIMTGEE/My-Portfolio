"use client";

import { useEffect, useState } from "react";

/**
 * Single source of truth for "is this visitor someone we should throw heavy
 * motion/3D/cursor effects at?" — combines the three signals that matter:
 *
 *  - prefers-reduced-motion: an explicit accessibility request, always wins
 *  - pointer: fine + hover: hover: a mouse/trackpad, not a touchscreen —
 *    magnetic buttons and a custom cursor make no sense without a cursor
 *  - viewport width: a rough proxy for "powerful enough device" — the brief
 *    calls for parallax/3D to be reduced or disabled on low-powered mobile,
 *    and narrow screens are the cheapest reliable signal for that without
 *    reading battery/GPU APIs that don't exist cross-browser
 *
 * Starts `false` on the server and first client render (SSR-safe, no
 * hydration mismatch), then updates after mount. Every consumer of this
 * should treat "false" as the safe default.
 */
export function useMotionCapability() {
  const [capable, setCapable] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const wideEnough = window.matchMedia("(min-width: 768px)");

    const update = () => {
      setFine(finePointer.matches && !reduced.matches);
      setCapable(!reduced.matches && wideEnough.matches);
    };

    update();
    reduced.addEventListener("change", update);
    finePointer.addEventListener("change", update);
    wideEnough.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      finePointer.removeEventListener("change", update);
      wideEnough.removeEventListener("change", update);
    };
  }, []);

  return {
    /** OK to run scroll-heavy / GPU-ish effects (3D scene, Lenis, etc). */
    capable,
    /** Has a real mouse/trackpad — OK for cursor-following effects. */
    fine,
  };
}
