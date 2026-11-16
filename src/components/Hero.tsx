"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@/lib/useGSAP";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { useMagnetic } from "@/lib/useMagnetic";
import { motion } from "framer-motion";
import { ArrowRight, Github, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { AvatarMark } from "./AvatarMark";

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

  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(fieldRef, (gsap, ScrollTrigger) => {
    const layers = fieldRef.current?.querySelectorAll<HTMLElement>("[data-speed]");
    if (layers?.length) {
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed ?? "0.2");
        gsap.to(layer, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: fieldRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }

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
          data-speed="0.15"
          className="ambient-glow absolute -left-32 top-[-8rem] h-[34rem] w-[34rem] animate-glow-pulse"
        />
        <div
          data-speed="0.3"
          className="ambient-glow absolute right-[-10rem] top-20 h-[30rem] w-[30rem] animate-glow-pulse"
          style={{ animationDelay: "-3s" }}
        />
        <div
          data-speed="0.45"
          className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_20%_20%,rgba(106,82,255,0.2),transparent_55%)]"
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

          <h1 className="font-display mt-5 text-[clamp(2.75rem,7.5vw,5.75rem)] font-semibold leading-[0.98] tracking-tight text-mist-100">
            {profile.heroHeadline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block ${i === profile.heroHeadline.length - 1 ? "text-gradient" : ""}`}
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-mist-400 sm:text-lg"
          >
            {profile.heroIntro}
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
              className="focus-ring group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(202,255,63,0)] transition hover:bg-accent-deep hover:shadow-[0_0_32px_4px_rgba(202,255,63,0.35)]"
            >
              Explore Projects
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-mist-500/25 px-6 py-3 text-sm font-semibold text-mist-100 transition hover:border-accent/50 hover:text-accent"
            >
              Contact Me
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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-6"
        >
          <div className="relative">
            <div
              className="ambient-glow absolute inset-0 -z-10 animate-glow-pulse"
              aria-hidden="true"
            />
            <AvatarMark size={176} />
          </div>

          <div className="glass-panel w-full rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-mist-300 shadow-xl shadow-black/30 sm:text-xs">
            <div className="mb-2 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p>
              <span className="text-accent-soft">const</span> dev = {"{"}
            </p>
            <p className="pl-4">
              name: <span className="text-signal-green">&apos;Tohybu Tajudeen&apos;</span>,
            </p>
            <p className="pl-4">
              stack: [<span className="text-signal-green">&apos;PHP&apos;</span>, <span className="text-signal-green">&apos;MySQL&apos;</span>, <span className="text-signal-green">&apos;JS&apos;</span>],
            </p>
            <p className="pl-4">
              learning: [<span className="text-signal-green">&apos;Python&apos;</span>, <span className="text-signal-green">&apos;Azure AI&apos;</span>],
            </p>
            <p className="pl-4">
              basedIn: <span className="text-signal-green">&apos;Accra, GH&apos;</span>,
            </p>
            <p>{"};"}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
