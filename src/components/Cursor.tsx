"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionCapability } from "@/lib/useMotionCapability";

/**
 * Desktop-only custom cursor: a small dot that leads, and a ring that trails
 * with slight lag, both easing toward the pointer rather than snapping to
 * it. Three states, not two:
 *
 * - idle: a thin ring in mix-blend-mode: difference, which inverts against
 *   whatever it's over — it stays visible crossing from the dark hero into
 *   a bright image without needing per-section color logic.
 * - hovering a plain interactive element (a, button, [data-cursor-hover]):
 *   the ring grows, still difference-blended.
 * - hovering something tagged [data-cursor-label="VIEW"] (project and repo
 *   cards): the ring becomes a solid, label-bearing pill instead — the
 *   signature Active Theory/Lusion "cursor tells you what happens if you
 *   click" interaction. Solid rather than blended here on purpose: a
 *   difference-blended pill with real text inside is illegible (the text's
 *   own color gets inverted by the same blend), so this one state breaks
 *   from the blend-mode trick and just uses a high-contrast solid fill.
 *
 * Renders nothing (returns null) whenever useMotionCapability says this
 * visitor doesn't have a fine pointer or has asked for reduced motion —
 * the OS cursor is simply left alone.
 */
export function Cursor() {
  const { fine } = useMotionCapability();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;

    let raf = 0;
    let running = false;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };

    const loop = () => {
      // Was 0.18 — closing an 18%-per-frame gap takes ~190ms to feel
      // "caught up," which reads as sluggish/unresponsive rather than a
      // tasteful trailing effect. 0.4 keeps a touch of the lead-dot/
      // trailing-ring look without the ring visibly lagging behind fast
      // mouse movement.
      ring.x += (pointer.x - ring.x) * 0.4;
      ring.y += (pointer.y - ring.y) * 0.4;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      // Stop once the ring has caught up and nothing is moving, instead of
      // running a mix-blend-mode-compositing frame forever for the entire
      // time anyone is on the page — onMove restarts it instantly, so
      // there's no visible gap, just no wasted frames while idle.
      const settled = Math.abs(pointer.x - ring.x) < 0.4 && Math.abs(pointer.y - ring.y) < 0.4;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) setVisible(true);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labeled = target?.closest<HTMLElement>("[data-cursor-label]");
      if (labeled) {
        setLabel(labeled.dataset.cursorLabel ?? null);
        setHovering(true);
        return;
      }
      setLabel(null);
      setHovering(Boolean(target?.closest("a, button, [data-cursor-hover]")));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    running = true;
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fine]);

  if (!fine) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-pulse will-change-transform"
        style={{
          opacity: label ? 0 : 1,
          transition: "opacity 0.2s ease",
          // A soft glow on the lead dot only — subtle enough not to fight
          // the ring's own difference-blend trick, but enough that the
          // cursor reads as "lit" rather than a flat UI dot.
          boxShadow: "0 0 12px 2px rgba(50,217,245,0.65)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border will-change-transform"
        style={
          label
            ? {
                minWidth: 72,
                height: 72,
                padding: "0 18px",
                borderColor: "transparent",
                backgroundColor: "#32D9F5",
                mixBlendMode: "normal",
                transition:
                  "min-width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), background-color 0.25s ease",
              }
            : {
                width: hovering ? 60 : 30,
                height: hovering ? 60 : 30,
                borderColor: "rgba(255,255,255,0.9)",
                backgroundColor: hovering ? "rgba(255,255,255,0.9)" : "transparent",
                mixBlendMode: "difference",
                transition:
                  "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), background-color 0.25s ease",
              }
        }
      >
        {label && <span className="cursor-label whitespace-nowrap">{label}</span>}
      </div>
    </div>
  );
}
