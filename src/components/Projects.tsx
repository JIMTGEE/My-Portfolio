"use client";

import { useRef, useState } from "react";
import { projects, projectCategories } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectSlide } from "./ProjectSlide";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { useGSAP } from "@/lib/useGSAP";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const { capable } = useMotionCapability();

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    // No `overflow-hidden` here: an `overflow` value other than `visible` on
    // any ancestor becomes the sticky containing block for the showcase's
    // `position: sticky` child below, and since this section itself never
    // scrolls internally, the browser was computing stickiness against that
    // (always-zero) internal scroll offset instead of the real page scroll —
    // sticky silently never engaged, so the showcase just scrolled past in
    // normal flow instead of pinning. The horizontally-translated track is
    // already clipped by the sticky wrapper's own `overflow-hidden` below,
    // so nothing escapes horizontally without this section needing it too.
    <section id="projects" className="relative py-24 sm:py-28 lg:py-0">
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
  // `outerRef` is a plain-flow element whose height we set explicitly (see
  // `setHeight` below) to the track's natural height plus however far it
  // needs to travel horizontally. The inner `.sticky` wrapper is what
  // visually "pins" — native `position: sticky`, not GSAP's `pin: true`.
  //
  // This sidesteps a real bug in the previous `pin: true` implementation:
  // with a function-based `end` (needed because the track's scroll
  // distance depends on viewport width/card count), GSAP's automatic
  // pin-spacer never reserved the extra scroll distance the pin itself was
  // using — the spacer kept `padding: 0`, so the page never grew to make
  // room for the pin. The result wasn't a stuck pin; it was content
  // (GitHub, then AI & Emerging Tech) sitting directly underneath Projects
  // in the DOM flow, inside the still-active pin window, so the fixed,
  // horizontally-scrubbing track visually bled over both sections for the
  // whole ~1700px the pin was active. By driving the spacing ourselves —
  // sticky needs no spacer at all — the reserved height and the scrub
  // distance can never disagree.
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(outerRef, (gsap, ScrollTrigger) => {
    const track = trackRef.current;
    const outer = outerRef.current;
    if (!track || !outer) return;

    const setHeight = () => {
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      outer.style.height = `${track.offsetHeight + extra}px`;
    };
    setHeight();

    // useGSAP wraps this whole callback in gsap.context() and reverts it
    // automatically on unmount — no manual cleanup needed here.
    gsap.to(track, {
      x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: () => "+=" + Math.max(0, track.scrollWidth - window.innerWidth),
        scrub: 0.7,
        invalidateOnRefresh: true,
        onRefresh: setHeight,
      },
    });
  });

  return (
    <div ref={outerRef} className="relative mt-12 lg:mt-14">
      <div className="sticky top-0 flex h-[78vh] items-center overflow-hidden sm:h-[80vh] lg:h-[84vh]">
        <div
          ref={trackRef}
          data-project-track
          className="flex h-[88%] gap-6 px-5 will-change-transform sm:gap-8 md:px-10 lg:gap-10"
        >
          {projects.map((p, i) => (
            <div key={p.slug} className="h-full w-[86vw] shrink-0 sm:w-[64vw] lg:w-[48vw]">
              <ProjectSlide
                project={p}
                index={i + 1}
                dimmed={filter !== "All" && p.category !== filter}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
