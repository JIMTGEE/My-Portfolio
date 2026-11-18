"use client";

import Link from "next/link";
import { ArrowUp, Github, Linkedin } from "lucide-react";
import { profile } from "@/data/profile";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#github", label: "GitHub" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist-500/10 bg-ink-950">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-mist-100">
            {profile.name}
          </p>
          <p className="mt-1 text-sm text-mist-500">{profile.title} — {profile.location}</p>
          <div className="mt-4 flex items-center gap-5">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 text-sm text-mist-400 transition hover:text-accent"
            >
              <Github size={16} /> github.com/JIMTGEE
            </a>
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 text-sm text-mist-400 transition hover:text-accent"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="Footer">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring text-mist-400 transition hover:text-mist-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="/#top"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center self-start rounded-full border border-mist-500/20 text-mist-300 transition hover:border-accent/50 hover:text-accent md:self-auto"
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </a>
      </div>
      <div className="border-t border-mist-500/10 py-5">
        <p className="container-page text-xs text-mist-500">
          © {year} {profile.name}. Built with Next.js, TypeScript & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
