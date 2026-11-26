"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently most "in view," using
 * the same generous top-biased rootMargin Nav.tsx used to compute its own
 * active-link indicator inline. Pulled out into a shared hook so the mobile
 * bottom dock (MobileDock.tsx) and the command palette's "jump to" ordering
 * can agree with the desktop nav about what's currently active instead of
 * each re-implementing (and potentially disagreeing on) the same
 * IntersectionObserver logic.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
