"use client";

import { useRef } from "react";
import { useParallaxField } from "@/lib/useParallaxField";

/**
 * The same "ambient glow + scroll parallax" background Hero introduced,
 * reused across every other section so the page-wide motion reads as one
 * continuous system rather than a hero-only effect. Absolutely-positioned
 * and `overflow-hidden`, so it never contributes to page-level horizontal
 * scroll regardless of how far its blobs sit outside their own box — the
 * parent `<section>` still needs its own `overflow-hidden` (Hero's pattern)
 * for the same reason, since these glows are sized larger than most section
 * paddings.
 *
 * `flip` mirrors the blob positions so alternating sections (every other
 * one uses `bg-ink-900/40`) don't all glow from the same corner.
 */
export function AmbientField({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useParallaxField(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        data-speed={flip ? "0.22" : "0.14"}
        className={`ambient-glow absolute top-[-6rem] h-[26rem] w-[26rem] animate-glow-pulse opacity-60 ${
          flip ? "right-[-9rem]" : "-left-20"
        }`}
      />
      <div
        data-speed={flip ? "0.14" : "0.22"}
        style={{ animationDelay: "-3s" }}
        className={`ambient-glow absolute bottom-[-8rem] h-[22rem] w-[22rem] animate-glow-pulse opacity-50 ${
          flip ? "-left-16" : "right-[-7rem]"
        }`}
      />
    </div>
  );
}
