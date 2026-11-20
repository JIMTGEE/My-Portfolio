import type { Metadata } from "next";
// Self-hosted via @fontsource rather than next/font/google: next/font/google
// fetches the actual font files from fonts.gstatic.com *during the Docker
// build itself*, and Render's build network can't reliably reach it — that
// network failure doesn't degrade gracefully, it throws a raw TypeError
// inside Next's font loader and fails the whole build (confirmed from a
// real Render build log: "request to https://fonts.gstatic.com/... failed"
// followed by "Cannot read properties of null (reading '1')" in
// @next/font/dist/google/loader.js). @fontsource ships the woff2 files
// straight from npm at install time, so there's no network call at build
// time at all, in any environment.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Intro } from "@/components/Intro";
import { profile } from "@/data/profile";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tohybu.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.heroIntro,
  keywords: [
    "Tohybu Tajudeen",
    "Web Developer Ghana",
    "PHP Developer",
    "Full Stack Developer",
    "Technology Entrepreneur",
    "NerdSpring",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.heroIntro,
    url: siteUrl,
    siteName: `${profile.name} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.heroIntro,
  },
  // No explicit icon list here on purpose: src/app/icon.png and
  // src/app/apple-icon.png (the real JIHOPE Tech "JH" mark, cropped from
  // the logo the client provided) are Next's file-convention icons, and
  // Next generates the correct <link rel="icon">/apple-touch-icon tags
  // for those automatically — a manual override here would just fight it.
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  sameAs: [profile.socials.github].filter(Boolean),
  knowsAbout: [
    "Web Development",
    "PHP",
    "MySQL",
    "JavaScript",
    "Python",
    "Microsoft Azure AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="vignette-overlay" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <Intro />
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          <ThemeProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
