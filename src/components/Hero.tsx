"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@/lib/useGSAP";
import { useParallaxField } from "@/lib/useParallaxField";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { useMagnetic } from "@/lib/useMagnetic";
import { motion } from "framer-motion";
import { ArrowRight, FolderGit2, Rocket, Github, Linkedin, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { AvatarMark } from "./AvatarMark";
import { StatNumber } from "./StatNumber";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// WebGL costs nothing until it's actually needed, and never ships to a
// server render (no DOM/canvas there) — loaded client-side only, and only
// ever mounted once useMotionCapability says this visitor can take it.
const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const wordVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const { capable, fine } = useMotionCapability();
  const ctaRef = useMagnetic<HTMLAnchorElement>(capable && fine, 0.3, 70);
  const reduce = usePrefersReducedMotion();
  const shippedCount = projects.length;

  const sceneRef = useRef<HTMLDivElement>(null);

  // Shared with every other section's ambient background (see AmbientField /
  // useParallaxField) so the same drift-on-scroll motion reads as one
  // consistent system across the whole page, not a hero-only trick.
  useParallaxField(fieldRef);

  useGSAP(fieldRef, (gsap, ScrollTrigger) => {
    // The hero's one cinematic scroll "set piece": scrolling past it zooms
    // the 3D scene and its glow outward and dissolves them, instead of the
    // section just sliding off underneath the next one like a stack of
    // cards. This is the moment meant to make the scroll itself feel like
    // part of the design, not just a way to move past it.
    if (sceneRef.current) {
      gsap.to(sceneRef.current, {
        scale: 1.35,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: fieldRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-ink-950 py-14"
    >
      {/*
        Parallax background field (blobs, grid, 3D canvas). `-z-10` here was
        the bug that made all of it invisible: this section paints its own
        opaque bg-ink-950 first, and a negative-z-index child of a
        `position: relative` box paints *below* that box's own background —
        so the entire layer, including the 3D scene, was rendering into a
        framebuffer that never reached the screen. Fix: leave this at the
        default stacking position (z-index: auto) and give the foreground
        content an explicit z-index instead, so paint order becomes
        section-bg -> this field -> foreground content.
      */}
      <div ref={fieldRef} className="pointer-events-none absolute inset-0">
        <div
          data-speed="0.45"
          className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_20%_20%,rgba(57,123,255,0.22),transparent_55%)]"
        />
        <svg
          data-speed="0.22"
          className="absolute inset-0 h-full w-full opacity-[0.09]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 44 0 L 0 0 0 44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-mist-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {capable && (
          <motion.div
            ref={sceneRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute inset-0"
          >
            <HeroScene />
          </motion.div>
        )}

        {/* Legibility scrim — the 3D scene and glow now span the full hero
            (the brief wants the 3D to read as the hero's main character, not
            a shy accent in one corner), so the copy column needs a solid-ish
            backdrop to stay readable over whatever's rendering behind it. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent lg:from-ink-950 lg:via-ink-950/35 lg:to-transparent" />
      </div>

      <div className="container-page relative z-10 grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-signal-green/30 bg-signal-green/5 px-3 py-1.5 text-xs font-medium text-signal-green"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
            </span>
            {profile.availability}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-medium uppercase tracking-[0.14em] text-mist-500"
          >
            {profile.positioning.split(" · ").map((role, i, arr) => (
              <span key={role} className="inline-flex items-center gap-2.5">
                {role}
                {i < arr.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-mist-500/50" aria-hidden="true" />
                )}
              </span>
            ))}
          </motion.p>

          {/* Name-forward headline — the thing that should be unmistakable
              in the first half-second on a page like this isn't a generic
              "building digital experiences" line every developer portfolio
              uses, it's whose site this is. Stacked, oversized, same
              Linear/Stripe/Vercel "the name IS the hero" treatment the
              brief pointed at, with the one concrete line of positioning
              (heroTagline) picking up where a vague tagline left off. */}
          <h1 className="font-display mt-5 text-[clamp(3.25rem,10vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-tight text-mist-100">
            {profile.name.split(" ").map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  className={`block ${i === 1 ? "text-gradient" : ""}`}
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: i * 0.12 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* The fuller heroIntro paragraph still exists (it's the SEO meta
              description — see layout.tsx) but doesn't also need to sit
              here: next to a name this large, one concrete tagline reads as
              confident; stacking a second paragraph under it just reads as
              dense, exactly what a premium hero shouldn't be. */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-5 max-w-xl text-lg font-medium leading-snug text-mist-200 sm:text-xl"
          >
            {profile.heroTagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              ref={ctaRef}
              href="#projects"
              className="focus-ring group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(50,217,245,0)] transition hover:bg-accent-deep hover:shadow-[0_0_32px_4px_rgba(50,217,245,0.35)]"
            >
              View Work
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-mist-500/25 px-6 py-3 text-sm font-semibold text-mist-100 transition hover:border-accent/50 hover:text-accent"
            >
              Contact
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-5 text-sm text-mist-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> {profile.location}
            </span>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 transition hover:text-accent"
            >
              <Github size={14} /> github.com/JIMTGEE
            </a>
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 transition hover:text-accent"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
          </motion.div>
        </div>

        {/* The identity mark, plus two small floating stat chips sitting
            over the 3D laptop scene — real, verified numbers (project
            count straight from data/projects.ts, same rule About's stats
            follow) rather than invented metrics, echoing the "floating
            cards" element next to a hero illustration without competing
            with the laptop for attention the way a second fake-terminal
            panel did. `lg:h-[22rem]` just gives the floating chips room to
            be positioned absolutely without the column collapsing to the
            avatar's own height. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-2 w-full max-w-sm lg:mt-auto lg:h-[22rem] lg:max-w-none lg:self-start"
        >
          {/* lg:absolute + bottom-left: in normal flow this would sit at
              the top of the column, right over the laptop screen's code
              lines — fine on mobile (no 3D scene there to collide with, see
              `capable` gating on HeroScene), but a real collision on desktop.
              Anchoring it to the column's bottom-left corner instead keeps
              it clear of the screen and reads as a deliberately "pinned"
              identity badge, the same idiom as the two stat chips. */}
          <div className="relative mx-auto w-fit lg:absolute lg:bottom-0 lg:left-0 lg:mx-0">
            <div
              className="ambient-glow absolute inset-0 -z-10 animate-glow-pulse"
              aria-hidden="true"
            />
            <AvatarMark size={120} />
          </div>

          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel absolute -right-1 top-6 hidden items-center gap-2.5 rounded-xl px-3.5 py-2.5 lg:flex"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-mist-500/15 bg-ink-800/60 text-accent-soft">
              <FolderGit2 size={15} />
            </span>
            <span>
              <span className="block font-display text-base font-semibold leading-none text-mist-100">
                <StatNumber value={shippedCount} suffix="+" />
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-wide text-mist-500">
                Systems shipped
              </span>
            </span>
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="glass-panel absolute bottom-10 right-10 hidden items-center gap-2.5 rounded-xl px-3.5 py-2.5 lg:flex"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-mist-500/15 bg-ink-800/60 text-pulse">
              <Rocket size={15} />
            </span>
            <span>
              <span className="block font-display text-base font-semibold leading-none text-mist-100">
                <StatNumber value={3} suffix="+" />
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-wide text-mist-500">
                Years building
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
