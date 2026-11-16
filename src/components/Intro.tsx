"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const SESSION_KEY = "intro-played";

/**
 * The first thing a visitor sees: a brief, branded loading beat — a
 * percentage counting up against a thin progress rule — before the curtain
 * lifts on the hero. This is the one piece of "the scroll/load itself is
 * part of the experience" that the reference sites (Active Theory, Lusion)
 * lead with on every visit, and the previous pass skipped it entirely in
 * favor of going straight to content.
 *
 * Shown once per browser tab (sessionStorage), not on every reload — Jim
 * will be refreshing this constantly while editing, and a returning
 * visitor re-triggering it on every anchor click would read as an
 * annoyance, not polish. Renders nothing at all for prefers-reduced-motion.
 *
 * SSR-safe by construction: `show` starts `true` on the server and on the
 * first client render (so hydration always agrees — same pattern as
 * useMotionCapability/usePrefersReducedMotion elsewhere in this codebase),
 * and the sessionStorage/reduced-motion check that can end it early only
 * runs after mount, in an effect.
 */
export function Intro() {
  const [show, setShow] = useState(true);
  const [percent, setPercent] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShow(false);
      return;
    }

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage can throw in private/locked-down contexts — treat
      // that the same as "not played yet" rather than letting it crash.
    }

    if (alreadyPlayed) {
      setShow(false);
      return;
    }

    const start = performance.now();
    const DURATION = 1100;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setPercent(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // best-effort only
          }
        }, 280);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950"
          aria-hidden="true"
        >
          <div className="ambient-glow absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-60" />
          <div className="relative flex flex-col items-center gap-6">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-mist-400">
              Tohybu Tajudeen
            </p>
            <p className="font-display text-6xl font-semibold tabular-nums text-mist-100 sm:text-7xl">
              {percent}
              <span className="text-pulse">%</span>
            </p>
            <div className="h-px w-40 overflow-hidden bg-mist-500/20 sm:w-56">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-pulse"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
