"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { useTilt } from "@/lib/useTilt";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * A single project card with a subtle 3D tilt + cursor-glare on hover
 * (fine-pointer visitors only — see useMotionCapability). Pulled out of
 * Projects.tsx so the tilt hook has one card's bounding box to work with,
 * not the whole grid's.
 */
export function ProjectCard({
  project,
  delay,
  index,
}: {
  project: Project;
  delay: number;
  /** 1-based position in the visible grid — rendered as an oversized
   *  case-study number, the same motif as SectionHeading's ghost numerals
   *  but scoped to this one card. */
  index: number;
}) {
  const { fine } = useMotionCapability();
  const tiltRef = useTilt<HTMLAnchorElement>(fine, 6);
  const num = String(index).padStart(2, "0");

  return (
    <RevealOnScroll delay={delay}>
      <Link
        ref={tiltRef}
        href={`/projects/${project.slug}`}
        data-cursor-label="View"
        className="focus-ring group relative block h-full overflow-hidden rounded-2xl border border-mist-500/10 bg-ink-900/40 transition duration-300 hover:-translate-y-1.5 hover:border-pulse/40 hover:shadow-[0_18px_60px_-12px_rgba(202,255,63,0.22)]"
      >
        <div className="relative aspect-[8/5] overflow-hidden border-b border-mist-500/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.08]"
          />
          {/* Color-wash that rises on hover — ties the otherwise static
              placeholder artwork to the accent/pulse palette instead of
              leaving the hover state to the border and arrow alone. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />
          <span
            aria-hidden="true"
            className="ghost-numeral absolute -bottom-3 -right-1 select-none text-[5rem] opacity-80 transition group-hover:opacity-100"
            style={{ WebkitTextStroke: "1px rgba(202,255,63,0.4)" }}
          >
            {num}
          </span>
          <span className="absolute left-3 top-3 rounded-full border border-mist-500/20 bg-ink-950/70 px-2.5 py-1 text-[11px] font-medium text-mist-300 backdrop-blur">
            {project.category}
          </span>
          {project.status === "In development" && (
            <span className="absolute right-3 top-3 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-soft backdrop-blur">
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
