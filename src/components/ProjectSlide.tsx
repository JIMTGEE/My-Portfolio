"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { useImageParallax } from "@/lib/useImageParallax";
import { useRef } from "react";

/**
 * One project, presented as a near-full-bleed cinematic "scene" rather than
 * a small boxed card — the pinned horizontal showcase's own slide, distinct
 * from ProjectCard (which stays as the compact grid tile for mobile/
 * reduced-motion visitors). Big image, big overlaid numeral + title, the
 * way Lusion/Active Theory present a case study: one thing fills the frame
 * at a time instead of a wall of small tiles.
 */
export function ProjectSlide({
  project,
  index,
  dimmed = false,
}: {
  project: Project;
  index: number;
  dimmed?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useImageParallax(ref);
  const num = String(index).padStart(2, "0");

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      data-cursor-label="View"
      className={`focus-ring group relative block h-full w-full overflow-hidden rounded-3xl border border-mist-500/10 bg-ink-900/60 transition-[opacity,filter] duration-500 ${
        dimmed ? "opacity-30 saturate-50" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt=""
        loading="lazy"
        decoding="async"
        data-parallax-img
        className="absolute inset-0 h-[130%] w-full object-cover transition duration-700 group-hover:scale-[1.06]"
      />

      {/* Heavy bottom scrim so the oversized title stays legible over
          whatever the screenshot happens to show underneath it. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-transparent" />

      <span
        aria-hidden="true"
        className="ghost-numeral absolute -top-2 left-4 select-none text-[7rem] leading-none opacity-70 transition duration-500 group-hover:opacity-100 sm:text-[9rem]"
        style={{ WebkitTextStroke: "1.5px rgba(50,217,245,0.5)" }}
      >
        {num}
      </span>

      <span className="absolute left-6 top-6 rounded-full border border-mist-500/25 bg-ink-950/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-mist-300 sm:left-8 sm:top-8">
        {project.category}
      </span>
      {project.status === "In development" && (
        <span className="absolute right-6 top-6 rounded-full border border-accent/40 bg-ink-950/80 px-3 py-1 text-[11px] font-medium text-accent-soft sm:right-8 sm:top-8">
          In development
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
        <p className="font-display text-3xl font-semibold leading-[1.02] text-mist-100 transition duration-300 sm:text-4xl lg:text-5xl">
          {project.name}
          <ArrowUpRight
            size={28}
            className="ml-2 inline-block -translate-y-1 text-mist-500 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-2 group-hover:text-pulse"
          />
        </p>
        <p className="max-w-lg text-sm leading-relaxed text-mist-300 sm:text-base">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-mist-500/20 bg-ink-950/60 px-2.5 py-0.5 text-[11px] text-mist-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="tilt-glare" aria-hidden="true" />
    </Link>
  );
}
