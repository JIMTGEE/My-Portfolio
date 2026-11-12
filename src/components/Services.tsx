import { services } from "@/data/services";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

export function Services() {
  return (
    <section id="services" className="relative bg-ink-900/40 py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Services"
          heading="What I can build for you"
          description="Practical, delivered work — not a menu of buzzwords."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <RevealOnScroll key={s.title} delay={(i % 3) * 0.08}>
              <div className="glass-panel h-full rounded-2xl p-6 transition hover:border-accent/30">
                <p className="font-display text-base font-semibold text-mist-100">
                  {s.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">
                  {s.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
