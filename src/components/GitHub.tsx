"use client";

import { useEffect, useState } from "react";
import { Github, GitFork, Star, AlertTriangle, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

type GHUser = {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
};

type GHRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

const languageColor: Record<string, string> = {
  PHP: "#8993be",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Shell: "#89e051",
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "rate-limited"; resetAt?: string }
  | { status: "ok"; user: GHUser; repos: GHRepo[] };

export function GitHubSection() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const username = profile.githubUsername;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
          fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
            { headers: { Accept: "application/vnd.github+json" } }
          ),
        ]);

        if (userRes.status === 403 || reposRes.status === 403) {
          const reset = userRes.headers.get("x-ratelimit-reset");
          if (!cancelled) {
            setState({
              status: "rate-limited",
              resetAt: reset
                ? new Date(Number(reset) * 1000).toLocaleTimeString()
                : undefined,
            });
          }
          return;
        }

        if (!userRes.ok || !reposRes.ok) {
          if (!cancelled) {
            setState({
              status: "error",
              message: `GitHub returned ${userRes.status} / ${reposRes.status}.`,
            });
          }
          return;
        }

        const user: GHUser = await userRes.json();
        const repos: GHRepo[] = await reposRes.json();

        const ranked = repos
          .filter((r) => !r.fork)
          .sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          })
          .slice(0, 6);

        if (!cancelled) setState({ status: "ok", user, repos: ranked });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Couldn't reach GitHub right now.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="relative bg-ink-900/40 py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="GitHub"
          heading="Live from my GitHub"
          description="Pulled directly from the GitHub API — not a curated screenshot. Real repositories, real activity."
        />

        <div className="mt-12">
          {state.status === "loading" && <GitHubSkeleton />}

          {state.status === "rate-limited" && (
            <RevealOnScroll className="glass-panel flex flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:items-center">
              <AlertTriangle size={20} className="shrink-0 text-accent-soft" />
              <div>
                <p className="text-sm font-medium text-mist-100">
                  GitHub&apos;s public API rate limit kicked in for this visitor.
                </p>
                <p className="mt-1 text-sm text-mist-400">
                  {state.resetAt
                    ? `It resets around ${state.resetAt}. `
                    : ""}
                  In the meantime, here&apos;s the profile directly.
                </p>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  <Github size={16} /> github.com/{profile.githubUsername}
                </a>
              </div>
            </RevealOnScroll>
          )}

          {state.status === "error" && (
            <RevealOnScroll className="glass-panel flex flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:items-center">
              <AlertTriangle size={20} className="shrink-0 text-accent-soft" />
              <div>
                <p className="text-sm font-medium text-mist-100">
                  {state.message}
                </p>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  <Github size={16} /> View the profile directly
                </a>
              </div>
            </RevealOnScroll>
          )}

          {state.status === "ok" && (
            <>
              <RevealOnScroll className="glass-panel grid grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4">
                <div className="col-span-2 flex items-center gap-4 sm:col-span-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.user.avatar_url}
                    alt={`${state.user.login}'s GitHub avatar`}
                    className="h-14 w-14 rounded-full border border-mist-500/15"
                  />
                  <a
                    href={state.user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring text-sm font-semibold text-mist-100 transition hover:text-accent"
                  >
                    @{state.user.login}
                  </a>
                </div>
                <Stat label="Public repos" value={state.user.public_repos} />
                <Stat label="Followers" value={state.user.followers} />
                <Stat label="Shown below" value={state.repos.length} />
              </RevealOnScroll>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {state.repos.map((r, i) => (
                  <RevealOnScroll key={r.id} delay={(i % 3) * 0.06}>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring group block h-full rounded-2xl border border-mist-500/10 bg-ink-900/30 p-5 transition hover:border-accent/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-mono text-sm font-semibold text-mist-100">
                          {r.name}
                        </p>
                        <ExternalLink
                          size={14}
                          className="mt-0.5 shrink-0 text-mist-500 transition group-hover:text-accent"
                        />
                      </div>
                      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-mist-400">
                        {r.description ?? "No description provided."}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-mist-500">
                        {r.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                background:
                                  languageColor[r.language] ?? "#717c9b",
                              }}
                            />
                            {r.language}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Star size={12} /> {r.stargazers_count}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GitFork size={12} /> {r.forks_count}
                        </span>
                      </div>
                    </a>
                  </RevealOnScroll>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-mist-100">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-mist-500">
        {label}
      </p>
    </div>
  );
}

function GitHubSkeleton() {
  return (
    <div aria-hidden="true" aria-busy="true" className="animate-pulse">
      <div className="glass-panel grid grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-ink-700/60" />
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-mist-500/10 bg-ink-900/30"
          />
        ))}
      </div>
    </div>
  );
}
