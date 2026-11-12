"use client";

import { GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { journey, education } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

function JourneyItem({ index, children }: { index: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="relative"
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.li>
  );
}

export function Journey() {
  return (
    <section id="journey" className="relative bg-ink-900/40 py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Professional Journey"
          heading="How I got here"
          description="Entrepreneurship, teaching, travel — and a straight line of self-directed technical learning running through all of it."
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_0.7fr]">
          <ol className="relative space-y-10 border-l border-mist-500/15 pl-8">
            {journey.map((j, i) => (
              <JourneyItem key={j.org} index={i}>
                <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-ink-950" />
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-soft">
                  {j.period}
                </p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
                  <h3 className="font-display text-lg font-semibold text-mist-100">
                    {j.org}
                  </h3>
                  <span className="text-sm text-mist-500">{j.role}</span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-400">
                  {j.description}
                </p>
                {j.href && (
                  <a
                    href={j.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring mt-2 inline-block text-xs font-medium text-accent"
                  >
                    Visit →
                  </a>
                )}
              </JourneyItem>
            ))}
          </ol>

          <RevealOnScroll delay={0.15} className="glass-panel h-fit rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-500">
              <GraduationCap size={14} /> Education
            </div>
            <ul className="mt-5 space-y-5">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="text-sm font-semibold text-mist-100">
                    {e.school}
                  </p>
                  <p className="mt-1 text-xs text-mist-400">{e.credential}</p>
                  <p className="mt-1 text-xs text-mist-500">{e.period}</p>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
