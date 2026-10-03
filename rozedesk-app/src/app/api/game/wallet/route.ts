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
import { GAME }                          from "@/lib/gameConstants";
import { readLiveGameConfig }              from "@/lib/gameConfig.server";

/** Read multiple integer platform settings in ONE query — DRY, one round-trip. */
async function getIntSettings(
  keys: string[],
  fallbacks: Record<string, number>,
): Promise<Record<string, number>> {
  try {
    const rows = await db.platformSetting.findMany({ where: { key: { in: keys } } });
    const map: Record<string, number> = {};
    for (const k of keys) {
      const row = rows.find(r => r.key === k);
      const v   = row ? parseInt(row.value, 10) : NaN;
      map[k]    = isNaN(v) || v < 1 ? fallbacks[k] ?? 0 : v;
    }
    return map;
  } catch {
    return Object.fromEntries(keys.map(k => [k, fallbacks[k] ?? 0]));
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    /* Load limits + wallet + earning config in parallel — Backend SOP §6.
       Keys MUST use "game." prefix to match what /api/admin/game-settings writes.
       Old keys "gameMinDeposit" etc. (no dot) never matched → admin changes silently ignored. */
    const settings = await getIntSettings(
      ["game.minDeposit", "game.minWager", "game.maxWager", "game.minWithdraw"],
      {
        "game.minDeposit":  GAME.MIN_DEPOSIT,
        "game.minWager":    GAME.MIN_WAGER,
        "game.maxWager":    GAME.MAX_WAGER,
        "game.minWithdraw": GAME.MIN_WITHDRAW,
      },
    );

    const [liveCfg, wallet] = await Promise.all([
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
      minDeposit:  settings["game.minDeposit"],
      minWager:    settings["game.minWager"],
      maxWager:    settings["game.maxWager"],
      minWithdraw: settings["game.minWithdraw"],
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
