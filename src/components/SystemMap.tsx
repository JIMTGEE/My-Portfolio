"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * The case-study page's "how it's wired together" diagram — the brief's
 * "visual architecture layer" / "animated system map" ask (its own example:
 * Students -> Admissions -> Attendance -> Fees -> Reports). Each step is a
 * real stage of that project's actual data flow (see data/projects.ts'
 * `systemMap`, only set for projects with a real backend pipeline), not a
 * generic box-and-arrow mockup.
 *
 * "Animated" here means two things, both tied to data actually moving
 * through the pipeline rather than decorative motion: the steps cascade in
 * left-to-right on scroll (so the eye reads it in the same order the data
 * actually flows), and a small pulse of light continuously travels down
 * each connector afterward — a quiet, looping "data is flowing through
 * this" cue, the same idea as the hero laptop's glowing active-line, reused
 * here instead of invented fresh. Both are skipped under reduced-motion;
 * the diagram still reads fine as a static flow without them.
 */
export function SystemMap({ steps }: { steps: string[] }) {
  const reduce = usePrefersReducedMotion();

  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-mist-500">
        <Layers size={14} className="text-accent-soft" /> How it&apos;s wired together
      </h2>
      <div className="glass-panel mt-4 overflow-x-auto rounded-2xl p-5">
        <div className="flex min-w-max flex-col gap-3 sm:min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-0">
              <motion.span
                initial={reduce ? undefined : { opacity: 0, y: 10, scale: 0.94 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative whitespace-nowrap rounded-xl border border-mist-500/15 bg-ink-800/60 px-3.5 py-2 text-xs font-medium text-mist-200 sm:text-sm"
              >
                {step}
              </motion.span>

              {i < steps.length - 1 && (
                <span
                  className="relative mx-2.5 flex shrink-0 items-center text-mist-600"
                  aria-hidden="true"
                >
                  <ArrowRight size={14} className="rotate-90 sm:rotate-0" />
                  {!reduce && (
                    <span className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
                      <motion.span
                        className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-pulse"
                        style={{ boxShadow: "0 0 6px 1px rgba(0,229,255,0.8)" }}
                        animate={{ left: ["0%", "100%"] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          repeatDelay: steps.length * 0.3,
                          delay: 1 + i * 0.25,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
