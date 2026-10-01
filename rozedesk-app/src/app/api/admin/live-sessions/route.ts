/**
 * GET /api/admin/live-sessions
 * Returns all currently ACTIVE (non-completed) game sessions across all players.
 * Used by the admin dashboard to show who is playing right now.
 *
 * Response includes per-session: player name, wager, time elapsed, and session ID
 * so the admin can target specific sessions with session-control.
 *
 * Backend SOP Hard Rule 1: requireAdmin.
 * Polling-friendly: lightweight query, no heavy joins.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const sessions = await db.gameSession.findMany({
      where:   { completed: false },
      orderBy: { startedAt: "desc" },
      take:    50,
      include: {
        wallet: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    return NextResponse.json({
      count: sessions.length,
      sessions: sessions.map(s => ({
        id:          s.id,
        userId:      s.userId,
        userName:    s.wallet.user.name,
        userEmail:   s.wallet.user.email,
        wagerAmount: s.wagerAmount,
        startedAt:   s.startedAt,
        /* elapsedSeconds — useful for UI display */
        elapsedSeconds: Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000),
      })),
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/live-sessions]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
