import { Code2, Rocket, GraduationCap, BrainCircuit } from "lucide-react";
import { profile, languages } from "@/data/profile";
import { projects } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";
import { StatNumber } from "./StatNumber";
import { BentoTile } from "./BentoTile";

// Verified statistics only (per the brief) — the project count comes
// straight from the data file rather than being typed as a separate
// number that could drift out of sync with it.
const stats = [
  { label: "Live systems shipped", value: projects.length },
  { label: "Core stack", value: "PHP · MySQL · JS" },
  { label: "Years building for clients", value: 3, suffix: "+" },
] satisfies Array<{ label: string; value: number | string; suffix?: string }>;

const tileIcons = {
  code: <Code2 size={18} />,
  rocket: <Rocket size={18} />,
  graduation: <GraduationCap size={18} />,
  brain: <BrainCircuit size={18} />,
} as const;

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-28">
      <div className="container-page relative z-10">
        <SectionHeading
          index="01"
          kicker={profile.about.kicker}
          heading={profile.about.heading}
          description="Four threads, not one wall of text — click a tile for the full story."
        />

        {/* Bento grid: four content tiles (2-wide/1-wide/1-wide/2-wide, so
            the two "headline" threads — day-to-day dev work and what's
            next — get the wider tiles) plus the verified stats and
            languages as their own small tiles, replacing the old plain
            two-column paragraph block. */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.about.tiles.map((t, i) => (
            <RevealOnScroll
              key={t.title}
              delay={i * 0.06}
              className={t.span === 2 ? "sm:col-span-2" : "sm:col-span-1"}
            >
              <BentoTile
                icon={tileIcons[t.icon as keyof typeof tileIcons]}
                title={t.title}
                teaser={t.teaser}
                body={t.body}
                span={t.span as 1 | 2}
              />
            </RevealOnScroll>
          ))}

          <RevealOnScroll delay={0.3} className="sm:col-span-1">
            <div className="glass-panel grid h-full grid-cols-1 gap-5 rounded-2xl p-6">
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
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.36} className="sm:col-span-1">
            <div className="glass-panel h-full rounded-2xl p-6">
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
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
