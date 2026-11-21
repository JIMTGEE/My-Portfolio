"use client";

import { useRef, useState } from "react";
import { projects, projectCategories } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { AmbientField } from "./AmbientField";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { useGSAP } from "@/lib/useGSAP";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const { capable } = useMotionCapability();
  if (typeof window !== "undefined") (window as unknown as { __capableDebug?: unknown }).__capableDebug = capable;

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-28 lg:py-0">
      <AmbientField flip />
      <div className="relative z-10 flex min-h-0 flex-col lg:min-h-screen lg:justify-center lg:py-20">
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
        </div>

        {capable ? (
          <PinnedShowcase filter={filter} />
        ) : (
          <div className="container-page">
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i + 1} delay={(i % 3) * 0.07} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * The pinned horizontal showcase (desktop/capable visitors only — see the
 * `capable` gate above, which already folds in prefers-reduced-motion and a
 * narrow-viewport check). While the page scrolls through this section's
 * height, GSAP pins it in place and translates the card track horizontally
 * instead, so vertical scroll distance drives horizontal motion — the
 * standard GSAP ScrollTrigger pin+scrub pattern.
 *
 * Every project stays mounted in the track regardless of the active filter
 * (see ProjectCard's `dimmed` prop) rather than being added/removed from
 * the DOM, which would shrink the track and force GSAP to recompute the
 * pin's scroll distance mid-interaction — a filter click while a visitor is
 * partway through the pinned scroll would otherwise yank the scroll
 * position. Dimming non-matches keeps the scroll math (and the visitor's
 * position in it) perfectly stable while still answering the filter.
 */
function PinnedShowcase({ filter }: { filter: (typeof projectCategories)[number] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(sectionRef, (gsap, ScrollTrigger) => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // useGSAP wraps this whole callback in gsap.context() and reverts it
    // automatically on unmount — no manual cleanup needed here.
    gsap.to(track, {
      x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.max(0, track.scrollWidth - window.innerWidth),
        scrub: 0.7,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  return (
    <div ref={sectionRef} className="mt-12 lg:mt-14">
      <div
        ref={trackRef}
        data-project-track
        className="flex gap-6 px-5 will-change-transform md:px-8"
      >
        {projects.map((p, i) => (
          <div key={p.slug} className="w-[72vw] shrink-0 sm:w-[42vw] lg:w-[26vw]">
            <ProjectCard
              project={p}
              index={i + 1}
              delay={0}
              dimmed={filter !== "All" && p.category !== filter}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
