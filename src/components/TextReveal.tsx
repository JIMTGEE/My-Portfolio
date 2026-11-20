"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/useGSAP";

/**
 * Word-by-word cinematic heading reveal, driven by GSAP + ScrollTrigger —
 * the sitewide counterpart to Hero's bespoke line-stagger entrance. Mounted
 * once inside SectionHeading, it cascades to every section's `<h2>`, which
 * is what makes the effect read as "consistent... from the beginning to the
 * end" rather than a hero-only flourish, without a second animation library:
 * same GSAP + useGSAP plumbing Hero and the parallax fields already use.
 *
 * Splits `text` into words (not characters — characters are far more nodes
 * for marginal visual gain) and reveals them with a short stagger as the
 * heading scrolls into view. Each word's wrapper is `overflow-hidden` so the
 * motion reads as the word rising into frame, not just fading.
 *
 * Falls back to fully-visible static text whenever useGSAP no-ops (reduced
 * motion or a narrow/low-powered viewport): the words' default CSS state is
 * opacity 1 / no transform, and gsap.set() below only ever *hides* them once
 * the effect actually runs — so skipping the effect never leaves text stuck
 * invisible.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGSAP(ref, (gsap) => {
    const nodes = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
    if (!nodes?.length) return;

    gsap.set(nodes, { yPercent: 115, opacity: 0 });
    gsap.to(nodes, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        once: true,
      },
    });
  });

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top pb-[0.08em]">
          <span data-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
