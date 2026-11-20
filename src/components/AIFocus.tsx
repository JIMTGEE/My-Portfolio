import { Sparkles, FlaskConical, BadgeCheck, GraduationCap, ExternalLink, FileText } from "lucide-react";
import { emergingFocus, emergingProjects, credentials, courseProgress } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

export function AIFocus() {
  return (
    <section id="ai" className="relative py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          index="06"
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
          <RevealOnScroll delay={0.12} className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-500">
              <BadgeCheck size={14} /> Credentials
            </div>
            <div className="mt-5 space-y-5">
              {credentials.map((c) => (
                <div key={c.title}>
                  <p className="text-sm font-semibold leading-snug text-mist-100">
                    {c.title}
                  </p>
                  <p className="mt-1.5 text-xs text-mist-400">
                    {c.issuer} · {c.date} · {c.duration}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {c.topSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-signal-green/25 bg-signal-green/5 px-2.5 py-0.5 text-[10px] text-mist-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={c.fileHref}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-soft transition hover:text-accent"
                  >
                    <FileText size={13} /> View certificate
                  </a>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <div className="flex flex-col gap-6">
            {courseProgress.map((course, ci) => (
              <RevealOnScroll
                key={course.title}
                delay={0.18 + ci * 0.06}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-500">
                    <GraduationCap size={14} /> In progress — {course.platform}
                  </div>
                  <a
                    href={course.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1 text-[11px] font-medium text-accent-soft transition hover:text-accent"
                  >
                    {course.currentModule} <ExternalLink size={11} />
                  </a>
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-mist-100">
                  {course.title}
                </p>

                {course.kind === "skills" ? (
                  <>
                    <p className="mt-1 text-xs text-mist-400">
                      Live skill XP from Coursera — small numbers, honestly shown, not a proficiency claim.
                    </p>
                    <div className="mt-5 space-y-3">
                      {course.skills.map((s) => {
                        const pct = Math.min(100, Math.round((s.xp / s.max) * 100));
                        return (
                          <div key={s.name}>
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-xs text-mist-300">{s.name}</span>
                              <span className="shrink-0 font-mono text-[10px] text-mist-500">
                                {s.xp}/{s.max} XP
                              </span>
                            </div>
                            <div
                              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist-500/10"
                              role="progressbar"
                              aria-label={s.name}
                              aria-valuenow={s.xp}
                              aria-valuemin={0}
                              aria-valuemax={s.max}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-accent to-pulse"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist-400">
                      <span>{course.completionPct}% course completion</span>
                      <span className="text-mist-500">·</span>
                      <span>
                        Weighted grade {course.weightedGrade}%{" "}
                        <span className="text-mist-500">({course.passingGrade}% to pass)</span>
                      </span>
                    </div>
                    <div
                      className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist-500/10"
                      role="progressbar"
                      aria-label={`${course.title} completion`}
                      aria-valuenow={course.completionPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-pulse"
                        style={{ width: `${Math.max(course.completionPct, 2)}%` }}
                      />
                    </div>
                    <div className="mt-5 space-y-3">
                      {course.modules.map((m) => {
                        const pct = Math.min(100, Math.round((m.correct / m.total) * 100));
                        return (
                          <div key={m.name}>
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-xs text-mist-300">
                                {m.name}
                                {m.complete && (
                                  <span className="ml-1.5 text-[10px] text-signal-green">✓</span>
                                )}
                              </span>
                              <span className="shrink-0 font-mono text-[10px] text-mist-500">
                                {m.correct}/{m.total}
                              </span>
                            </div>
                            <div
                              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist-500/10"
                              role="progressbar"
                              aria-label={m.name}
                              aria-valuenow={m.correct}
                              aria-valuemin={0}
                              aria-valuemax={m.total}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-accent to-pulse"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
