"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin progress line fixed to the very top of the viewport, filling left to
 * right with scroll position. Framer's useScroll already reads native
 * scroll — no extra wiring needed. useSpring just smooths it so it doesn't
 * feel like a raw percentage snapping around.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
