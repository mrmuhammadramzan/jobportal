/**
 * POST /api/game/session     — start a game (deduct wager)
 * PATCH /api/game/session    — end a game (submit score, credit winnings)
 * Body POST:  { wagerAmount: number }
 * Body PATCH: { sessionId: string, finalScore: number, cashout: boolean }
 *
 * Backend SOP Hard Rules:
 *   1 — wagerAmount, finalScore, and cashout validated server-side
 *   6 — balance deduction + session create in one DB transaction (atomic)
 *   §4.3 — PATCH is idempotent: if session already completed, returns 200 with cached result
 *
 * ECONOMY RULE (enforced server-side):
 *   cashout=true  → player pressed SECURE → winAmount = wager × multiplier
 *   cashout=false → bird escaped / hunter won → winAmount = 0 (wager forfeited)
 *   The client sends finalScore in both cases; the server IGNORES finalScore for
 *   payout when cashout=false. This prevents a bird that escapes at 5× from
 *   triggering a payout — the client cannot forge a win by sending a high score.
 */
import { NextRequest, NextResponse }  from "next/server";
import { db }                        from "@/lib/db";
import { requireAuth }               from "@/lib/apiAuth";
import { createNotification }        from "@/lib/notify";
import { calculateCrashWin }         from "@/lib/gameConstants";
import { readLiveWagerLimits }       from "@/lib/gameConfig.server";

/* ── START SESSION ── */
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { wagerAmount } = await req.json() as { wagerAmount?: number };

    if (!wagerAmount || typeof wagerAmount !== "number") {
      return NextResponse.json({ message: "wagerAmount is required." }, { status: 400 });
    }

    /* Read live wager limits from DB — never hardcoded constants.
       Admin changes in /admin/game-settings take effect on the next session start. */
    const limits = await readLiveWagerLimits();

    if (wagerAmount < limits.minWager) {
      return NextResponse.json({
        message: `Minimum wager is Rs. ${limits.minWager}.`,
      }, { status: 400 });
    }
    if (wagerAmount > limits.maxWager) {
      return NextResponse.json({
        message: `Maximum wager is Rs. ${limits.maxWager}.`,
      }, { status: 400 });
    }

    /* Atomic: deduct balance + create session */
    const session = await db.$transaction(async (tx) => {
      const wallet = await tx.gameWallet.findUnique({ where: { userId: auth.id } });

      if (!wallet) {
        throw Object.assign(new Error("WALLET_NOT_FOUND"), { status: 404 });
      }
      if (wallet.balance < wagerAmount) {
        throw Object.assign(new Error("INSUFFICIENT_BALANCE"), { status: 402 });
      }

      await tx.gameWallet.update({
        where: { id: wallet.id },
        data:  { balance: { decrement: wagerAmount } },
      });

      return tx.gameSession.create({
        data: {
          walletId:    wallet.id,
          userId:      auth.id,
          wagerAmount,
          finalScore:  0,
          winAmount:   0,
          milestones:  [],
          completed:   false,
        },
      });
    });

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    if (e instanceof Error) {
      const cast = e as Error & { status?: number };
      if (cast.status === 404) return NextResponse.json({ message: "Wallet not found." }, { status: 404 });
      if (cast.status === 402) return NextResponse.json({ message: "Insufficient balance." }, { status: 402 });
    }
    console.error("[POST /api/game/session]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

/* ── END SESSION ── */
export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { sessionId, finalScore, cashout } = await req.json() as {
      sessionId?:  string;
      finalScore?: number;
      cashout?:    boolean;
    };

    if (!sessionId || typeof finalScore !== "number" || finalScore < 0) {
      return NextResponse.json(
        { message: "sessionId and a non-negative finalScore are required." },
        { status: 400 },
      );
    }

    /* Hard cap: finalScore is multiplier × 100, capped at 100000 = 1000×.
       Without this, a client could submit finalScore=999999999 to claim a
       9,999,999× payout. The cap is generous (1000× is already extreme).  */
    const MAX_FINAL_SCORE = 100_000; // 1000× max
    if (finalScore > MAX_FINAL_SCORE) {
      return NextResponse.json(
        { message: `finalScore exceeds maximum allowed value (${MAX_FINAL_SCORE}).` },
        { status: 400 },
      );
    }

    /* cashout must be an explicit boolean — reject missing/null to prevent
       accidental free wins from clients that omit the field.               */
    if (typeof cashout !== "boolean") {
      return NextResponse.json(
        { message: "cashout (boolean) is required." },
        { status: 400 },
      );
    }

    /* Load session — ownership check (Backend SOP §6.2) */
    const session = await db.gameSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ message: "Session not found." }, { status: 404 });
    }
    if (session.userId !== auth.id) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    /* Idempotent: already completed → return cached result (Backend SOP §4.3) */
    if (session.completed) {
      return NextResponse.json({
        winAmount:    session.winAmount,
        finalScore:   session.finalScore,
        milestones:   session.milestones,
        milestoneWin: 0,
        jackpotWin:   0,
      });
    }

    /* ── CRASH-GAME PAYOUT ────────────────────────────────────────────────────
       cashout=true  → player pressed SECURE → payout = wager × multiplier
       cashout=false → bird escaped (hunter won) → payout = 0, wager forfeited
       The server NEVER trusts finalScore alone for the payout decision.
       A malicious client could send cashout=false with a high finalScore — the
       cashout gate blocks any payout regardless of the score value.           */
    const totalWin = cashout
      ? calculateCrashWin(session.wagerAmount, finalScore).winAmount
      : 0;

    const milestoneWin  = 0;
    const jackpotWin    = 0;
    const milestones: number[] = [];

    /* Atomic: update session + conditionally credit wallet */
    const updated = await db.$transaction(async (tx) => {
      const s = await tx.gameSession.update({
        where: { id: sessionId },
        data:  {
          finalScore,
          winAmount:  totalWin,
          milestones: milestones as unknown as never,
          endedAt:    new Date(),
          completed:  true,
        },
      });

      if (totalWin > 0) {
        await tx.gameWallet.update({
          where: { id: session.walletId },
          data:  { balance: { increment: totalWin } },
        });
      }

      return s;
    });

    /* User notification — only on actual win (non-fatal) */
    if (totalWin > 0) {
      await createNotification({
        userId: auth.id,
        title:  "You Won!",
        body:   `You secured the bird at ${(finalScore / 100).toFixed(2)}× and earned Rs. ${totalWin}.`,
        type:   "success",
        link:   "/dashboard/game",
      });
    }

    return NextResponse.json({
      winAmount:   updated.winAmount,
      finalScore:  updated.finalScore,
      milestones:  updated.milestones,
      milestoneWin,
      jackpotWin,
    });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/game/session]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
