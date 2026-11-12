import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/projects";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      title: project.name,
      description: project.summary,
      images: [{ url: project.image }],
    },
  };
}

const stages: { key: "problem" | "approach" | "outcome"; label: string }[] = [
  { key: "problem", label: "The problem" },
  { key: "approach", label: "The approach" },
  { key: "outcome", label: "The outcome" },
];

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const related = projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 2);

  return (
    <article className="py-20 sm:py-24">
      <div className="container-page max-w-3xl">
        <Link
          href="/#projects"
          className="focus-ring inline-flex items-center gap-2 text-sm text-mist-400 transition hover:text-accent"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <RevealOnScroll>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
            {project.category} · {project.role}
          </div>
          <h1 className="font-display mt-4 text-3xl font-semibold text-mist-100 sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-mist-400">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
              >
                Visit live site <ArrowUpRight size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-mist-500/25 px-5 py-2.5 text-sm font-semibold text-mist-100 transition hover:border-accent/50 hover:text-accent"
              >
                <Github size={14} /> View source
              </a>
            )}
            <span className="rounded-full border border-mist-500/20 px-3 py-1.5 text-xs text-mist-400">
              {project.status}
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            className="mt-10 w-full rounded-2xl border border-mist-500/10"
          />
        </RevealOnScroll>

        <div className="mt-12 space-y-10">
          {stages.map((s, i) => (
            <RevealOnScroll key={s.key} delay={i * 0.06}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-signal-green">
                {s.label}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-mist-300">
                {project[s.key]}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2} className="mt-12">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-mist-500">
            Built with
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-mist-500/15 px-3 py-1 text-xs text-mist-300"
              >
                {t}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        {related.length > 0 && (
          <div className="mt-16 border-t border-mist-500/10 pt-10">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-mist-500">
              More {project.category.toLowerCase()} work
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="focus-ring group block rounded-xl border border-mist-500/10 p-4 transition hover:border-accent/30"
                >
                  <p className="font-display text-sm font-semibold text-mist-100">
                    {p.name}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs text-mist-400">
                    {p.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
