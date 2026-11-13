# syntax=docker/dockerfile:1
#
# Multi-stage build for the Next.js portfolio, producing a minimal
# "standalone" runtime image (see output: "standalone" in next.config.mjs).
# Built for Render's runtime: docker (linux/amd64, BuildKit).

ARG NODE_VERSION=20

# ---- deps: install dependencies only (cached unless package*.json change) ----
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: compile the Next.js app ----
FROM node:${NODE_VERSION}-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_SITE_URL is read in Server Components only (layout/sitemap/
# robots) in this app, not in any "use client" file, so it does not need to
# be baked in at build time — it's picked up from the runtime env below.
RUN npm run build

# ---- runner: minimal production image ----
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Next's standalone server defaults to binding localhost only; Render's
# health check and edge reach the container on all interfaces.
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ARG PORT=10000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "server.js"]
