"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/useGSAP";
import { motion } from "framer-motion";
import { ArrowRight, Github, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { AvatarMark } from "./AvatarMark";

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

  useGSAP(fieldRef, (gsap, ScrollTrigger) => {
    const layers = fieldRef.current?.querySelectorAll<HTMLElement>("[data-speed]");
    if (!layers?.length) return;

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
  });

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink-950 pb-24 pt-14 sm:pt-20"
    >
      {/* Parallax background field */}
      <div ref={fieldRef} className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-speed="0.15"
          className="absolute -left-24 top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          data-speed="0.3"
          className="absolute right-[-8rem] top-32 h-[24rem] w-[24rem] rounded-full bg-accent-violet/10 blur-3xl"
        />
        <div
          data-speed="0.45"
          className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_20%_20%,rgba(79,125,255,0.14),transparent_55%)]"
        />
        <svg
          data-speed="0.22"
          className="absolute inset-0 h-full w-full opacity-[0.07]"
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
      </div>

      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
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

          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.08] text-mist-100 sm:text-5xl lg:text-6xl">
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
              href="#projects"
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
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
          <AvatarMark size={176} />

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
