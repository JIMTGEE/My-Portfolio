import { profile, languages } from "@/data/profile";
import { projects } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

const stats = [
  { label: "Live systems shipped", value: `${projects.length}` },
  { label: "Core stack", value: "PHP · MySQL · JS" },
  { label: "Years building for clients", value: "3+" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <SectionHeading
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
                  {s.value}
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
