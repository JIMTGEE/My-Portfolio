import { RevealOnScroll } from "./RevealOnScroll";

export function SectionHeading({
  kicker,
  heading,
  description,
  align = "left",
  index,
}: {
  kicker: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  /** "01", "02"… — rendered as a large faint watermark behind the kicker.
   *  The Active Theory/Lusion case-study index motif, repeated once per
   *  section so it reads as a running numbering of the whole page rather
   *  than a one-off decoration. */
  index?: string;
}) {
  return (
    <RevealOnScroll
      className={`relative ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}
    >
      {index && (
        <span
          aria-hidden="true"
          className={`ghost-numeral pointer-events-none absolute -top-6 text-[4.5rem] sm:-top-10 sm:text-[7rem] lg:text-[9rem] ${
            align === "center" ? "left-1/2 -translate-x-1/2" : "-left-1 sm:-left-2 lg:-left-4"
          }`}
        >
          {index}
        </span>
      )}
      <div
        className={`relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
        {kicker}
      </div>
      <h2 className="font-display relative mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-mist-100 sm:text-5xl lg:text-6xl">
        {heading}
      </h2>
      {description && (
        <p className="relative mt-4 text-base leading-relaxed text-mist-400">
          {description}
        </p>
      )}
    </RevealOnScroll>
  );
}
