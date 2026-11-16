"use client";

import { useCountUp } from "@/lib/useCountUp";

/**
 * Renders a single numeric stat that counts up from 0 once scrolled into
 * view (see lib/useCountUp.ts). Kept as its own tiny client component so
 * About.tsx — otherwise plain server-rendered content — only pays the
 * "use client" cost on the few digits that actually animate.
 */
export function StatNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <span ref={ref}>
      {animated}
      {suffix}
    </span>
  );
}
