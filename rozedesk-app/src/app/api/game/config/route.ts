/**
 * GET /api/game/config
 * Public endpoint (auth required — seeker only) that returns the live game
 * configuration the FlappyBird canvas reads before starting a session.
 *
 * Returned shape matches GameConfig interface in FlappyBird.tsx.
 * All values come from platform_settings DB (admin-controlled) with
 * env-var fallbacks so a fresh install works without any DB rows.
 *
 * Backend SOP §6.1: requireAuth (not admin) — every player gets config.
 * Security: biasMode is resolved per-user here (blocked players forced to lose).
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

async function getStr(key: string, fallback: string): Promise<string> {
  try {
    const row = await db.platformSetting.findUnique({ where: { key: `game.${key}` } });
    return row?.value ?? fallback;
  } catch { return fallback; }
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    /* Load all game settings in parallel */
    const keys = [
      "winInterval","winPerStep","jackpotScore","jackpotMult",
      "jackpotBonusScore","jackpotBonusMult",
      "biasMode","escapeMin","escapeMax","minDeposit","minWager","maxWager",
    ];
    const defaults: Record<string, string> = {
      winInterval:"100", winPerStep:"10", jackpotScore:"1000", jackpotMult:"1.0",
      jackpotBonusScore:"1200", jackpotBonusMult:"1.2",
      biasMode:"none",
      escapeMin: process.env.GAME_ESCAPE_MIN  ?? "1.1",
      escapeMax: process.env.GAME_ESCAPE_MAX  ?? "12",
      minDeposit: process.env.GAME_MIN_DEPOSIT ?? "120",
      minWager:   process.env.GAME_MIN_WAGER   ?? "120",
      maxWager:   process.env.GAME_MAX_WAGER   ?? "10000",
    };

    const rows = await db.platformSetting.findMany({
      where: { key: { in: keys.map(k => `game.${k}`) } },
    });
    const map = Object.fromEntries(rows.map(r => [r.key.replace("game.", ""), r.value]));

    /* Check if user is blocked — blocked users always lose */
    const user = await db.user.findUnique({
      where: { id: auth.id },
      select: { blocked: true },
    }).catch(() => null);

    const biasMode = user?.blocked ? "loss" : (map.biasMode ?? defaults.biasMode);

    /* ── Server-side sanity guards — prevent exploitable admin settings ── */
    const rawJackpot      = parseInt(map.jackpotScore      ?? defaults.jackpotScore,      10);
    const rawBonus        = parseInt(map.jackpotBonusScore ?? defaults.jackpotBonusScore, 10);
    const rawJackpotMult  = parseFloat(map.jackpotMult      ?? defaults.jackpotMult);
    const rawBonusMult    = parseFloat(map.jackpotBonusMult ?? defaults.jackpotBonusMult);
    const safeJackpot     = Math.min(rawJackpot, 99999);
    const safeBonusScore  = Math.max(rawBonus, safeJackpot + 50);   /* bonus > jackpot always */
    const safeJackpotMult = Math.min(Math.max(rawJackpotMult, 0.1), 10);   /* 0.1× – 10× */
    const safeBonusMult   = Math.min(Math.max(rawBonusMult, safeJackpotMult), 20); /* ≥ jackpotMult, ≤ 20× */

    /* ── Check for admin speedup flag on an active session ────────────────
       session-control route writes `session.{id}.speedup` to platform_settings.
       We look up if there's a speedup flag set within the last 60 s for ANY
       of this user's active sessions (the client doesn't know its own sessionId
       before the round starts, so we resolve it by userId here).             */
    let adminSpeedup = false;
    try {
      const activeSessions = await db.gameSession.findMany({
        where:   { userId: auth.id, completed: false },
        select:  { id: true },
      });
      if (activeSessions.length > 0) {
        const speedupKeys = activeSessions.map(s => `session.${s.id}.speedup`);
        const speedupRows = await db.platformSetting.findMany({
          where: { key: { in: speedupKeys } },
        });
        const cutoff = Date.now() - 60_000;  // flag valid for 60 s
        adminSpeedup = speedupRows.some(r => parseInt(r.value, 10) > cutoff);
        /* Clean up expired flags */
        const expiredKeys = speedupRows
          .filter(r => parseInt(r.value, 10) <= cutoff)
          .map(r => r.key);
        if (expiredKeys.length > 0) {
          db.platformSetting.deleteMany({ where: { key: { in: expiredKeys } } }).catch(() => {});
        }
      }
    } catch { /* non-fatal — speedup is optional feature */ }

    return NextResponse.json({
      winInterval:      Math.max(1, parseInt(map.winInterval ?? defaults.winInterval, 10)),
      winPerStep:       Math.min(10000, parseFloat(map.winPerStep ?? defaults.winPerStep)),
      jackpotScore:     safeJackpot,
      jackpotMult:      safeJackpotMult,
      jackpotBonusScore:safeBonusScore,
      jackpotBonusMult: safeBonusMult,
      biasMode,
      escapeMin: Math.max(1.01, parseFloat(map.escapeMin ?? defaults.escapeMin)),
      escapeMax: Math.min(100,  parseFloat(map.escapeMax ?? defaults.escapeMax)),
      minDeposit: Math.max(1, parseInt(map.minDeposit ?? defaults.minDeposit, 10)),
      minWager:   Math.max(1, parseInt(map.minWager   ?? defaults.minWager,   10)),
      maxWager:   Math.max(1, parseInt(map.maxWager   ?? defaults.maxWager,   10)),
      adminSpeedup,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/game/config]", e);
    return NextResponse.json({ message: "Failed to load game config." }, { status: 500 });
  }
}
