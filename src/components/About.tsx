import { profile, languages } from "@/data/profile";
import { projects } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { StatNumber } from "./StatNumber";

// Verified statistics only (per the brief) — the project count comes
// straight from the data file rather than being typed as a separate
// number that could drift out of sync with it.
const stats = [
  { label: "Live systems shipped", value: projects.length },
  { label: "Core stack", value: "PHP · MySQL · JS" },
  { label: "Years building for clients", value: 3, suffix: "+" },
] satisfies Array<{ label: string; value: number | string; suffix?: string }>;

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-28">
      <div className="container-page relative z-10 grid gap-14 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <SectionHeading
            index="01"
            kicker={profile.about.kicker}
            heading={profile.about.heading}
          />
          <div className="mt-8 space-y-5">
            {profile.about.paragraphs.map((p, i) => (
              <RevealOnScroll key={p.slice(0, 24)} delay={i * 0.06}>
                <p className="max-w-2xl text-[15px] leading-relaxed text-mist-400">
                  {p}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <RevealOnScroll className="glass-panel grid grid-cols-1 gap-6 rounded-2xl p-6 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-semibold text-mist-100">
                  {typeof s.value === "number" ? (
                    <StatNumber value={s.value} suffix={s.suffix} />
                  ) : (
                    s.value
                  )}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-mist-500">
                  {s.label}
                </p>
              </div>
            ))}
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="glass-panel rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">
              Languages
            </p>
            <ul className="mt-4 space-y-3">
              {languages.map((l) => (
                <li
                  key={l.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-mist-200">{l.name}</span>
                  <span className="text-mist-500">{l.level}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
