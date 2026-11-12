import { RevealOnScroll } from "./RevealOnScroll";

export function SectionHeading({
  kicker,
  heading,
  description,
  align = "left",
}: {
  kicker: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <RevealOnScroll
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <div
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
        {kicker}
      </div>
      <h2 className="font-display mt-4 text-3xl font-semibold text-mist-100 sm:text-4xl">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-mist-400">
          {description}
        </p>
      )}
    </RevealOnScroll>
  );
}
