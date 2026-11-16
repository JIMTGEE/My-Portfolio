"use client";

import { useState } from "react";
import { projects, projectCategories } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index="04"
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
            <ProjectCard key={p.slug} project={p} index={i + 1} delay={(i % 3) * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
