/**
 * POST /api/admin/session-control
 * Body: { sessionId, action: "crash" | "speedup" }
 *
 * Allows admin to:
 *   "crash"   — forcibly end an active session with score 0 (natural-looking loss)
 *               → sets completed=true, winAmount=0, endedAt=now
 *               → balance NOT refunded (wager was already deducted at start)
 *   "speedup" — marks the session so the next pipe has max speed
 *               → stored in platform_settings as a per-session flag
 *               → FlappyBird polls /api/game/config which resolves this flag
 *
 * Security: requireAdmin, ownership not required (admin controls all sessions).
 * Backend SOP Hard Rule 6: session update is atomic.
 * Backend SOP §4.3: crash is idempotent — already-completed sessions return 200.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { createNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const { sessionId, action } = await req.json() as {
      sessionId?: string;
      action?:    "crash" | "speedup";
    };

    if (!sessionId || !action)
      return NextResponse.json({ message: "sessionId and action are required." }, { status: 400 });
    if (!["crash", "speedup"].includes(action))
      return NextResponse.json({ message: "action must be 'crash' or 'speedup'." }, { status: 400 });

    const session = await db.gameSession.findUnique({
      where: { id: sessionId },
      include: { wallet: { include: { user: { select: { id: true, name: true } } } } },
    });

    if (!session)
      return NextResponse.json({ message: "Session not found." }, { status: 404 });

    /* Idempotent — already done */
    if (session.completed && action === "crash")
      return NextResponse.json({ success: true, message: "Already completed." });

    if (action === "crash") {
      /* Force-end the session with score 0 — wager is lost (already deducted) */
      await db.gameSession.update({
        where: { id: sessionId },
        data: {
          completed:  true,
          finalScore: session.finalScore, /* keep whatever they had */
          winAmount:  0,
          endedAt:    new Date(),
          /* Store crash flag so FlappyBird knows to die naturally */
          milestones: { set: ["__admin_crash__"] } as never,
        },
      });

      /* Notify player (non-fatal) */
      await createNotification({
        userId: session.userId,
        title:  "Game Over",
        body:   "Your game session was ended. Please start a new game.",
        type:   "warning",
        link:   "/dashboard/game",
      });

      return NextResponse.json({ success: true, action: "crash" });
    }

    /* speedup: store a per-session flag in platform_settings that the
       game config endpoint reads. The key is `session.{id}.speedup`.
       FlappyBird polls /api/game/config which checks for this flag.
       Auto-expires after 60 seconds to avoid stale data. */
    if (action === "speedup") {
      await db.platformSetting.upsert({
        where:  { key: `session.${sessionId}.speedup` },
        create: { key: `session.${sessionId}.speedup`, value: String(Date.now()), updatedAt: new Date() },
        update: { value: String(Date.now()), updatedAt: new Date() },
      });
      return NextResponse.json({ success: true, action: "speedup" });
    }

    return NextResponse.json({ message: "Unknown action." }, { status: 400 });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/admin/session-control]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
