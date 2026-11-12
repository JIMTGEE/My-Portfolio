# Tohybu Tajudeen — Portfolio

Personal developer portfolio for Tohybu Tajudeen: web developer, technology
entrepreneur (JIHOPE, formerly NerdSpring), and emerging AI/ML practitioner.

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP
ScrollTrigger. No CMS — all content lives in `src/data/*.ts`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint     # ESLint (next/core-web-vitals)
npm run typecheck
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. **Nothing
is required to run the site locally** — see "What degrades gracefully"
below.

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Correct SEO/OG metadata, sitemap, robots.txt | Defaults to a placeholder domain |
| `RESEND_API_KEY` | Contact form actually sending email | From [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | Contact form | Where submissions land |
| `CONTACT_FROM_EMAIL` | Contact form | Must be on a Resend-verified domain |

Set the same variables as **Environment Variables** in your Vercel project
settings for production — `.env.local` only applies locally and is
git-ignored.

## What degrades gracefully

This site is built so a missing integration never breaks the page for a
visitor:

- **Contact form** — without `RESEND_API_KEY`/`CONTACT_TO_EMAIL`, the form
  shows a clear "not configured yet" message with a `mailto:` fallback
  instead of silently failing.
- **GitHub section** — fetches live from the public GitHub REST API
  (unauthenticated, 60 req/hr per visitor IP). Shows a loading skeleton,
  and a dedicated rate-limit message (with a link straight to the GitHub
  profile) if that limit is hit. If you outgrow this, proxy the request
  through a server route with a `GITHUB_TOKEN` to raise the limit.

## Content you still need to fill in

A few things were intentionally left as clearly-marked placeholders
rather than invented — grep for `TODO` or check:

- **`src/data/profile.ts`** — `socials.email`, `socials.linkedin`,
  `socials.whatsapp` are empty. The Contact section and footer quietly
  hide any of these that are blank rather than showing a dead link.
- **Profile photo** — `src/components/AvatarMark.tsx` renders an abstract
  initials mark as a placeholder. Swap it for `<Image src="/avatar.jpg" .../>`
  once you have a real photo (drop the file in `public/`).
- **Project screenshots** — `public/projects/*.svg` are generated
  placeholder art (not real screenshots), one per project. Replace with
  real screenshots whenever you have them; update the `image` path in
  `src/data/projects.ts` if you switch to `.png`/`.jpg`.
- **NerdSpring → JIHOPE timeline** — `src/data/profile.ts` (`journey`)
  and `src/data/projects.ts` describe NerdSpring as a 2025–2026 venture
  that ended, with JIHOPE as the current one. Double-check those dates
  and the wording match how you want it told.
- **Repositories not meant to be shown** — if any of the GitHub repos
  returned by the live GitHub section shouldn't be public-facing here,
  make them private on GitHub (the API only returns what it can see) —
  there's no allow/block list in the code to maintain instead.

## Project structure

```
src/
  app/
    page.tsx              # homepage — assembles all sections
    layout.tsx             # root layout, metadata, JSON-LD
    projects/[slug]/       # case-study pages, one per project
    actions/contact.ts     # server action: validates + sends via Resend
    sitemap.ts / robots.ts # generated from src/data/projects.ts
  components/               # one component per homepage section
  data/                      # profile.ts, projects.ts, services.ts, skills.ts
  lib/                        # useGSAP hook, cn()/initials() helpers
```

## Deployment (Vercel)

1. Push this repo to GitHub (already done if you're reading this there).
2. Import it in Vercel → New Project.
3. Add the environment variables above under Project Settings →
   Environment Variables.
4. Deploy. Point your domain at it and set `NEXT_PUBLIC_SITE_URL` to match.
