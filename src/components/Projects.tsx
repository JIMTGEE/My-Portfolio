"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, projectCategories } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Projects"
            heading="Systems I've actually shipped"
            description="Real client work — public sites, admin dashboards, and the problems they were built to solve. Not a mockup in the bunch."
          />

          <div className="flex flex-wrap gap-2">
            {projectCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`focus-ring rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  filter === c
                    ? "border-accent/50 bg-accent/10 text-accent-soft"
                    : "border-mist-500/20 text-mist-400 hover:border-mist-500/40 hover:text-mist-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <RevealOnScroll key={p.slug} delay={(i % 3) * 0.07}>
              <Link
                href={`/projects/${p.slug}`}
                className="focus-ring group block h-full overflow-hidden rounded-2xl border border-mist-500/10 bg-ink-900/40 transition hover:-translate-y-1 hover:border-accent/30"
              >
                <div className="relative aspect-[8/5] overflow-hidden border-b border-mist-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-mist-500/20 bg-ink-950/70 px-2.5 py-1 text-[11px] font-medium text-mist-300 backdrop-blur">
                    {p.category}
                  </span>
                  {p.status === "In development" && (
                    <span className="absolute right-3 top-3 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-soft backdrop-blur">
                      In development
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-base font-semibold text-mist-100">
                      {p.name}
                    </p>
                    <ArrowUpRight
                      size={16}
                      className="mt-1 shrink-0 text-mist-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-400">
                    {p.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-mist-500/15 px-2.5 py-0.5 text-[11px] text-mist-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-mist-500">
                    {p.liveUrl && <span>Live site</span>}
                    {p.githubUrl && (
                      <span className="inline-flex items-center gap-1">
                        <Github size={12} /> Source
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
