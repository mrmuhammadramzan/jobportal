/**
 * GET /api/fee — returns the current application fee (public, no auth).
 *
 * Seeker-facing pages (apply, job detail) call this to show the live fee.
 * Falls back to APP_FEE_PKR env var if DB is unreachable.
 *
 * DRY: single source of truth for fee — all pages read from here.
 * Backend SOP §7: timeout/fallback defined.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const FALLBACK_FEE = parseInt(process.env.APP_FEE_PKR ?? "150", 10);

export async function GET() {
  try {
    const row = await db.platformSetting.findUnique({ where: { key: "appFee" } });
    const fee = row ? parseInt(row.value, 10) : FALLBACK_FEE;
    return NextResponse.json({ fee: isNaN(fee) ? FALLBACK_FEE : fee });
  } catch {
    /* DB unreachable — return env fallback */
    return NextResponse.json({ fee: FALLBACK_FEE });
  }
}
