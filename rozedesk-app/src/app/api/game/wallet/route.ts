/**
 * GET /api/game/wallet
 * Returns the authenticated user's game wallet (creates one if absent).
 * Also returns deposit history, active sessions, and live platform limits.
 *
 * minDeposit / minWager are read from platform_settings DB first so the
 * admin can change them without a redeploy. Falls back to GAME constants
 * (which fall back to env vars) if the table row doesn't exist yet.
 *
 * Backend SOP §6.1: requireAuth — checks JWT, not just "logged in".
 * Backend SOP Hard Rule 2: no silent catch — errors propagate with context.
 * DRY: GAME constants are the single env-backed fallback — not duplicated here.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }                       from "@/lib/db";
import { requireAuth }               from "@/lib/apiAuth";
import { readLiveGameConfig, readLiveWagerLimits } from "@/lib/gameConfig.server";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    /* Load limits + wallet + earning config in parallel */
    const [settings, liveCfg, wallet] = await Promise.all([
      readLiveWagerLimits(),
      readLiveGameConfig(),
      db.gameWallet.upsert({
        where:  { userId: auth.id },
        create: { userId: auth.id, balance: 0 },
        update: {},
        include: {
          deposits: {
            orderBy: { submittedAt: "desc" },
            take: 20,
            select: {
              id: true, amount: true, method: true,
              status: true, submittedAt: true, rejectionReason: true,
            },
          },
          sessions: {
            orderBy: { startedAt: "desc" },
            take: 20,
            select: {
              id: true, wagerAmount: true, finalScore: true,
              winAmount: true, startedAt: true, completed: true,
            },
          },
          _count: { select: { sessions: true } },
        },
      }),
    ]);

    return NextResponse.json({
      balance:    wallet.balance,
      walletId:   wallet.id,
      deposits:   wallet.deposits,
      sessions:   wallet.sessions,
      totalGames: wallet._count.sessions,
      minDeposit:  settings.minDeposit,
      minWager:    settings.minWager,
      maxWager:    settings.maxWager,
      minWithdraw: settings.minWithdraw,
      /* Live earning config — used by prize preview and wager selector */
      winInterval:       liveCfg.winInterval,
      winPerStep:        liveCfg.winPerStep,
      jackpotScore:      liveCfg.jackpotScore,
      jackpotMult:       liveCfg.jackpotMult,
      jackpotBonusScore: liveCfg.jackpotBonusScore,
      jackpotBonusMult:  liveCfg.jackpotBonusMult,
    });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[GET /api/game/wallet]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
