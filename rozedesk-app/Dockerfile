# ══════════════════════════════════════════════════════════════════════════════
# RozeDesk — Multi-stage Dockerfile
# ══════════════════════════════════════════════════════════════════════════════
# Stage 1 (deps)    — install production + dev dependencies
# Stage 2 (builder) — generate Prisma client + build Next.js standalone
# Stage 3 (runner)  — minimal production image (~200 MB)
#
# DevOps SOP §4: self-contained deployment unit.
# DevOps SOP Hard Rule 1: no secrets baked in — all from runtime env vars.
# DevOps SOP Hard Rule 4: runs as non-root user.
#
# Build:  docker build -t rozedesk .
# Run:    docker run -p 3000:3000 --env-file .env.production rozedesk
# ══════════════════════════════════════════════════════════════════════════════

# ── Stage 1: dependency install ───────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files from the app directory
COPY package.json package-lock.json ./

# Install all deps (including devDeps needed for build)
RUN npm ci --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the app source
COPY . .

# Copy Prisma schema from the monorepo root (one level up in the repo)
# The schema lives at ../prisma/schema.prisma relative to this Dockerfile.
# We copy it into /prisma/ so the Prisma generate command can find it.
COPY ../prisma ./prisma

# Set build-time env vars that Next.js needs at build time.
# These are NOT secrets — just metadata.
# Runtime secrets (DATABASE_URL, JWT_SECRET, etc.) are injected at container start.
ARG NEXT_PUBLIC_APP_URL=https://yourdomain.com
ARG NEXT_PUBLIC_APP_FEE=150
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_FEE=$NEXT_PUBLIC_APP_FEE

# Prisma generate (outputs to src/generated/prisma as per schema.prisma generator)
# Uses the schema from /prisma/schema.prisma
RUN node node_modules/prisma/build/index.js generate --schema=./prisma/schema.prisma

# Build Next.js standalone output
# next.config.ts must have output: "standalone"
RUN npm run build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user — DevOps SOP Hard Rule 4: least privilege
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public folder (logos, default assets)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create uploads directory — writable by app user.
# Note: on serverless/ephemeral containers this is in-memory only.
# For persistent uploads configure STORAGE_PROVIDER in env and use cloud storage.
RUN mkdir -p ./public/uploads/cv ./public/uploads/receipts \
 && chown -R nextjs:nodejs ./public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check — maps to GET /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
