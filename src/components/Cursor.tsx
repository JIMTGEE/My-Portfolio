"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionCapability } from "@/lib/useMotionCapability";

/**
 * Desktop-only custom cursor: a small dot that leads, and a ring that trails
 * with slight lag, both easing toward the pointer rather than snapping to
 * it. The ring scales up and the dot fades over anything interactive
 * (links, buttons, [data-cursor-hover]) so hovering a project card or CTA
 * reads as a deliberate state change, the way it does on Active Theory /
 * Lusion — without hijacking the actual cursor or blocking clicks anywhere.
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;

    let raf = 0;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [data-cursor-hover]")));
    };

    const loop = () => {
      ring.x += (pointer.x - ring.x) * 0.18;
      ring.y += (pointer.y - ring.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
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
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent-soft will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border will-change-transform"
        style={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          borderColor: hovering ? "rgba(79,125,255,0.55)" : "rgba(154,163,189,0.4)",
          backgroundColor: hovering ? "rgba(79,125,255,0.08)" : "transparent",
          transition:
            "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, background-color 0.25s ease",
        }}
      />
    </div>
  );
}
