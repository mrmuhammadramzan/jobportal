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
   * output: "standalone"
   * Produces a self-contained build in .next/standalone/ that includes
   * only the server runtime + required node_modules.
   * Required for Docker / Railway / Render / VPS deployments.
   * DevOps SOP §4: deployment unit must be self-contained.
   */
  output: "standalone",

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

  /* Turbopack root fix — only needed in dev due to monorepo double package-lock */
  ...(isProd ? {} : {
    turbopack: { root: __dirname },
  }),

  /* LAN dev origins — dev only, empty in production */
  ...(allowedDevOrigins.length > 0 && { allowedDevOrigins }),
};

export default nextConfig;
