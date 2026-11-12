import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent-soft">
        404
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold text-mist-100 sm:text-4xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-400">
        The link might be broken, or the page may have moved. Head back to
        the homepage and try from there.
      </p>
      <Link
        href="/"
        className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
      >
        Back to homepage
      </Link>
    </div>
  );
}
