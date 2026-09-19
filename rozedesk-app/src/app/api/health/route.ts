/**
 * GET /api/health
 *
 * Lightweight liveness + readiness probe.
 * Used by Docker HEALTHCHECK, Railway, Render, load balancers, uptime monitors.
 *
 * Returns 200 { status: "ok" }    — app + DB reachable
 * Returns 503 { status: "error" } — DB unreachable (app is up but not ready)
 *
 * DevOps SOP Hard Rule 7: no monitoring, no launch.
 * Security: never leak internal error messages to the outside world.
 *   - Error detail logged server-side only.
 *   - Response body contains no DB topology, credentials, or stack traces.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const t0 = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status:   "ok",
      database: "connected",
      latencyMs: Date.now() - t0,
      time:     new Date().toISOString(),
      env:      process.env.NODE_ENV ?? "unknown",
    });
  } catch (error) {
    /* Log full error server-side — never expose to client */
    console.error("[/api/health] Database probe failed:", error);
    return NextResponse.json({
      status:   "error",
      database: "unreachable",
      time:     new Date().toISOString(),
    }, { status: 503 });
  }
}
