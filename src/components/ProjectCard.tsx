"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { useTilt } from "@/lib/useTilt";
import { useImageParallax } from "@/lib/useImageParallax";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * A single project card with a subtle 3D tilt + cursor-glare on hover
 * (fine-pointer visitors only — see useMotionCapability), plus a scroll-
 * linked image parallax (see useImageParallax) layered on the same ref —
 * two independent, reusable scroll/pointer effects rather than one bespoke
 * blob of card animation logic. Pulled out of Projects.tsx so the hooks
 * have one card's bounding box to work with, not the whole grid's.
 */
export function ProjectCard({
  project,
  delay,
  index,
  dimmed = false,
}: {
  project: Project;
  delay: number;
  /** 1-based position in the visible grid — rendered as an oversized
   *  case-study number, the same motif as SectionHeading's ghost numerals
   *  but scoped to this one card. */
  index: number;
  /** True when a category filter is active and this card doesn't match —
   *  used by the pinned horizontal showcase, which keeps every card in the
   *  track (so GSAP's scroll distance never has to be recalculated) and
   *  fades non-matches instead of removing them. */
  dimmed?: boolean;
}) {
  const { fine } = useMotionCapability();
  const tiltRef = useTilt<HTMLAnchorElement>(fine, 14);
  useImageParallax(tiltRef);
  const num = String(index).padStart(2, "0");

  return (
    // min-w-0 matters here, not just as defensive boilerplate: this is a
    // CSS Grid item on the mobile fallback grid, and a grid item's default
    // min-width is `auto` (≈ its content's max-content size). The metrics
    // strip below is `truncate` (white-space: nowrap + ellipsis), and
    // without min-w-0 here, the pre-ellipsis nowrap width of the *longest*
    // metrics string was winning the grid's track-sizing pass before
    // truncate's own overflow:hidden ever got a chance to clip it — a few
    // extra pixels of real page-level horizontal scroll on every card, not
    // just a clipped-looking one.
    <RevealOnScroll
      delay={delay}
      className={dimmed ? "min-w-0 transition duration-500" : "min-w-0"}
    >
      <Link
        ref={tiltRef}
        href={`/projects/${project.slug}`}
        data-cursor-label="View"
        className={`focus-ring group relative block h-full overflow-hidden rounded-2xl border border-mist-500/10 bg-ink-900/40 transition duration-300 hover:-translate-y-1.5 hover:border-pulse/40 hover:shadow-[0_18px_60px_-12px_rgba(0,229,255,0.22)] ${
          dimmed ? "opacity-30 saturate-50" : "opacity-100"
        }`}
      >
        <div className="relative aspect-[8/5] overflow-hidden border-b border-mist-500/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            data-parallax-img
            className="h-[114%] w-full object-cover transition duration-500 group-hover:scale-[1.08]"
          />
          {/* Color-wash that rises on hover — ties the otherwise static
              placeholder artwork to the accent/pulse palette instead of
              leaving the hover state to the border and arrow alone. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />
          <span
            aria-hidden="true"
            className="ghost-numeral absolute -bottom-3 right-0 select-none text-[3.75rem] opacity-80 transition group-hover:opacity-100 sm:text-[5rem]"
            style={{ WebkitTextStroke: "1px rgba(0,229,255,0.45)" }}
          >
            {num}
          </span>
          {/* Solid-enough background instead of backdrop-blur — this badge
              repeats on every card in the grid, and backdrop-filter forces a
              live resample of whatever's behind it on every scroll frame,
              same reasoning as .glass-panel in globals.css. */}
          <span className="absolute left-3 top-3 rounded-full border border-mist-500/20 bg-ink-950/90 px-2.5 py-1 text-[11px] font-medium text-mist-300">
            {project.category}
          </span>
          {project.status === "In development" && (
            <span className="absolute right-3 top-3 rounded-full border border-accent/40 bg-ink-950/80 px-2.5 py-1 text-[11px] font-medium text-accent-soft">
              In development
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-lg font-semibold text-mist-100">
              {project.name}
            </p>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-mist-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pulse"
            />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-400">
            {project.summary}
          </p>
          {/* "Stop listing projects, start showing case studies" — a quick
              scan of what the system actually covers, distinct from the
              tech-stack chips below it. Capped at 2 so a compact card never
              wraps onto a third line. */}
          {project.metrics && project.metrics.length > 0 && (
            <p className="mt-2 truncate text-xs font-medium text-accent-soft">
              {project.metrics.slice(0, 2).join(" · ")}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-mist-500/15 px-2.5 py-0.5 text-[11px] text-mist-400"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-mist-500">
            {project.liveUrl && <span>Live site</span>}
            {project.githubUrl && (
              <span className="inline-flex items-center gap-1">
                <Github size={12} /> Source
              </span>
            )}
          </div>
        </div>

        <div className="tilt-glare" aria-hidden="true" />
      </Link>
    </RevealOnScroll>
  );
}
