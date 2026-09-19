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
   * Security headers — applied to every response.
   * DevOps SOP Hard Rule 4: private by default; no unintentional exposure.
   * These headers protect against common web vulnerabilities.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          /* Prevent clickjacking */
          { key: "X-Frame-Options",           value: "DENY" },
          /* Stop MIME-type sniffing */
          { key: "X-Content-Type-Options",    value: "nosniff" },
          /* Block reflected XSS */
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          /* Restrict referrer info */
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          /* Permissions policy — disable unused browser features */
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          /* HSTS — prod only (dev uses http) */
          ...(isProd ? [{
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          }] : []),
        ],
      },
    ];
  },

  /* Turbopack root — always set to this app's directory to prevent Turbopack
     from walking up to the monorepo root and failing to resolve CSS plugins.
     Without this, in production Railway builds Turbopack finds /app/package-lock.json
     (the root lockfile) and looks for @tailwindcss/postcss in the wrong node_modules. */
  turbopack: { root: __dirname },

  /* LAN dev origins — dev only, empty in production */
  ...(allowedDevOrigins.length > 0 && { allowedDevOrigins }),
};

export default nextConfig;
