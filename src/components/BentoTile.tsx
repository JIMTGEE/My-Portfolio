"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * One tile in About's bento grid: a short teaser is always visible, and
 * clicking the tile reveals the full paragraph beneath it — the "each tile
 * opens details" progressive-disclosure pattern, instead of the dense wall
 * of four full paragraphs the section used to be. `span` controls how many
 * of the grid's 4 columns this tile claims at the `lg` breakpoint.
 */
export function BentoTile({
  icon,
  title,
  teaser,
  body,
  span = 1,
}: {
  icon: ReactNode;
  title: string;
  teaser: string;
  body: string;
  span?: 1 | 2;
}) {
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className={cn(
        "glass-panel group relative flex flex-col rounded-2xl p-6 text-left transition hover:border-accent/30",
        span === 2 ? "sm:col-span-2" : "sm:col-span-1"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mist-500/15 bg-ink-800/60 text-accent-soft">
          {icon}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mist-500/20 text-mist-400 transition",
            open ? "rotate-45 border-accent/50 text-accent" : "group-hover:text-mist-100"
          )}
          aria-hidden="true"
        >
          <Plus size={14} />
        </span>
      </div>

      <h3 className="font-display mt-4 text-lg font-semibold text-mist-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mist-400">{teaser}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-4 border-t border-mist-500/10 pt-4 text-sm leading-relaxed text-mist-300">
              {body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
