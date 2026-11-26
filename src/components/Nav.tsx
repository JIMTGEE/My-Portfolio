"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useMotionCapability } from "@/lib/useMotionCapability";
import { useMagnetic } from "@/lib/useMagnetic";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useActiveSection } from "@/lib/useActiveSection";

const links = [
  { href: "/#about", label: "About", id: "about" },
  { href: "/#expertise", label: "Expertise", id: "expertise" },
  { href: "/#services", label: "Services", id: "services" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#github", label: "GitHub", id: "github" },
  { href: "/#ai", label: "AI & ML", id: "ai" },
  { href: "/#journey", label: "Journey", id: "journey" },
  { href: "/#contact", label: "Contact", id: "contact" },
];

const sectionIds = links.map((l) => l.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { capable, fine } = useMotionCapability();
  const reduce = usePrefersReducedMotion();
  const ctaRef = useMagnetic<HTMLAnchorElement>(capable && fine, 0.3, 60);
  // Shared with MobileDock and the command palette (see lib/useActiveSection)
  // so every "where am I" indicator on the page agrees with every other one.
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        scrolled
          ? "border-b border-mist-500/10 bg-ink-950/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/#top"
          className="focus-ring group flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-mist-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/jihope-mark-256.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-md transition duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
          />
          Tohybu<span className="text-accent">.</span>dev
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "focus-ring relative px-2 py-1.5 text-sm transition",
                active === l.id ? "text-mist-100" : "text-mist-400 hover:text-mist-100"
              )}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-accent"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("command-palette:open"))}
            className="focus-ring hidden items-center gap-2 rounded-full border border-mist-500/20 px-3 py-1.5 text-xs text-mist-400 transition hover:border-accent/40 hover:text-mist-100 sm:inline-flex"
            aria-label="Open command palette"
          >
            <Search size={13} />
            <kbd className="font-mono text-[10px] text-mist-500">⌘K</kbd>
          </button>
          <ThemeToggle />
          <a
            ref={ctaRef}
            href="/#contact"
            className="focus-ring hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep sm:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-mist-500/20 text-mist-200 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] overflow-y-auto bg-ink-950/98 backdrop-blur-md transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
      >
        <nav
          className="container-page flex flex-col gap-1 py-8"
          aria-label="Mobile menu"
        >
          <AnimatePresence>
            {open &&
              links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? undefined : { opacity: 0, x: -16 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "focus-ring border-b border-mist-500/10 py-4 text-lg",
                    active === l.id ? "text-accent-soft" : "text-mist-200"
                  )}
                >
                  {l.label}
                </motion.a>
              ))}
          </AnimatePresence>
          <a
            href="/#contact"
            onClick={() => setOpen(false)}
            className="focus-ring mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
          >
            Let&apos;s talk
          </a>
        </nav>
      </div>
    </header>
  );
}
