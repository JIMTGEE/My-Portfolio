import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ink = surface/background tokens, mist = foreground/text & border
        // tokens. Both are defined as CSS variables (see globals.css) so
        // every component that already uses bg-ink-900, text-mist-100, etc.
        // automatically repaints for :root[data-theme="light"] — no
        // component needs a dark:/light: variant of its own.
        ink: {
          950: "rgb(var(--ink-950) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          850: "rgb(var(--ink-850) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
        },
        mist: {
          100: "rgb(var(--mist-100) / <alpha-value>)",
          200: "rgb(var(--mist-200) / <alpha-value>)",
          300: "rgb(var(--mist-300) / <alpha-value>)",
          400: "rgb(var(--mist-400) / <alpha-value>)",
          500: "rgb(var(--mist-500) / <alpha-value>)",
        },
        // Primary accent: indigo (the redesign brief's exact #4F46E5).
        // Secondary accent (accent-violet, the brief's #7C3AED) and
        // highlight (pulse, below, the brief's #00E5FF) complete the
        // three-color accent system — indigo carries primary actions and
        // links, violet marks secondary/alternate emphasis, cyan is the one
        // "electric" pop reserved for a few deliberate moments (see pulse
        // comment).
        accent: {
          DEFAULT: "#4F46E5",
          soft: "#A5B4FC",
          violet: "#7C3AED",
          deep: "#4338CA",
        },
        // pulse = the one neon "pop" color (highlight accent, the brief's
        // exact #00E5FF cyan), reserved for the few moments that should
        // feel electric rather than tasteful: cursor hover labels, index
        // numerals, CTA glows, the hero scene's rim light. Used sparingly
        // on purpose — a studio site has one signature pop accent, not five.
        pulse: {
          DEFAULT: "#00E5FF",
          soft: "#67E8F9",
          deep: "#00B8CC",
        },
        signal: {
          green: "#36d399",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(57,123,255,0.12), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.06)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        blink: "blink 1s step-end infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
