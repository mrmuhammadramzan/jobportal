import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * allowedDevOrigins — LAN IPs that can reach the dev server.
 * Read from ALLOWED_DEV_ORIGINS env var (comma-separated).
 * Only applied outside production — zero effect in production builds.
 * DevOps SOP: never hardcode IPs; use env vars.
 */
const allowedDevOrigins: string[] = !isProd && process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map(s => s.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  /**
   * output: "standalone" is disabled for Railway deployment.
   * Railway runs a persistent Node process — standalone is only needed for
   * Docker images or serverless. Using next start directly is simpler and
   * avoids monorepo path resolution issues with the standalone server.js.
   *
   * Re-enable for Dockerfile-based deployments:
   * output: "standalone",
   */

  /**
   * Image optimization — Next.js serves WebP/AVIF automatically.
   * remotePatterns allows <Image> to load from Supabase storage + any https origin.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "**" }, // catch-all for job company logos etc.
    ],
    minimumCacheTTL: 3600, // cache optimised images for 1 hour
  },

  /**
   * Security headers — applied to every response.
   * DevOps SOP Hard Rule 4: private by default; no unintentional exposure.
   */
  async headers() {
    return [
      /* ── Global security headers ── */
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
        ],
      },
      /* ── Public job listings — safe to cache at CDN edge for 60s ── */
      {
        source: "/api/jobs",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      /* ── Admin analytics — private, cache 60s at server only ── */
      {
        source: "/api/admin/analytics",
        headers: [
          { key: "Cache-Control", value: "private, max-age=60" },
        ],
      },
      /* ── Static public assets — aggressive caching ── */
      {
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  /* Turbopack root — always set to this app's directory to prevent Turbopack
     from walking up to the monorepo root and failing to resolve CSS plugins.

     IMPORTANT: Turbopack cache location is controlled via the env var
     NEXT_TURBOPACK_CACHE_PATH in .env.local (dev) or hosting config (prod).
     This moves the cache outside .next so deleting .next never corrupts it. */
  turbopack: { root: __dirname },

  /* LAN dev origins — dev only, empty in production */
  ...(allowedDevOrigins.length > 0 && { allowedDevOrigins }),
};

export default nextConfig;
