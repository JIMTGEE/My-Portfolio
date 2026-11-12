import { Sparkles, FlaskConical } from "lucide-react";
import { emergingFocus, emergingProjects } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

export function AIFocus() {
  return (
    <section id="ai" className="relative py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="AI & Emerging Technologies"
          heading="Where I'm headed next"
          description="Learning in public, with a concrete target rather than buzzword-collecting. Clearly separated from the working skills above."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="grid gap-5 sm:grid-cols-3">
            {emergingFocus.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-dashed border-accent/25 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-accent-soft" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-soft">
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold text-mist-100">
                    {f.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mist-400">
                    {f.note}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.1} className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-500">
              <FlaskConical size={14} /> Concepts in progress
            </div>
            <div className="mt-5 space-y-6">
              {emergingProjects.map((p) => (
                <div key={p.title}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-mist-100">
                      {p.title}
                    </p>
                    <span className="shrink-0 rounded-full border border-accent/30 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-soft">
                      {p.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
