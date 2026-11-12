import { workingSkills, learningSkills } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

export function Expertise() {
  return (
    <section id="expertise" className="relative py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Expertise"
          heading="What I work with — and what I'm still learning"
          description="I keep a clear line between skills I use professionally day to day and technologies I'm actively learning. Nothing below is overstated."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-signal-green">
              Working skills
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {workingSkills.map((group, i) => (
                <RevealOnScroll key={group.category} delay={i * 0.05}>
                  <div className="glass-panel h-full rounded-xl p-5">
                    <p className="text-sm font-semibold text-mist-100">
                      {group.category}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-signal-green/25 bg-signal-green/5 px-3 py-1 text-xs text-mist-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-soft">
              Learning / exploring
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {learningSkills.map((group, i) => (
                <RevealOnScroll key={group.category} delay={i * 0.05}>
                  <div className="h-full rounded-xl border border-dashed border-accent/25 p-5">
                    <p className="text-sm font-semibold text-mist-100">
                      {group.category}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-accent/30 px-3 py-1 text-xs text-accent-soft"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
