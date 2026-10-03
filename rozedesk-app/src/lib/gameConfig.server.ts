/**
 * gameConfig.server.ts — SERVER-ONLY live game config reader.
 *
 * The `server-only` import makes Next.js/Turbopack throw a build error if
 * this file is ever imported by a "use client" component — preventing the
 * mariadb Node.js driver from leaking into the browser bundle.
 *
 * Import pattern for API routes and server utilities:
 *   import { readLiveGameConfig } from "@/lib/gameConfig.server";
 *
 * NEVER import this in "use client" files. Use the wallet API response
 * (which already includes live config fields) in client components.
 */
import "server-only";

import { db }            from "@/lib/db";
import { GAME, LiveGameConfig } from "@/lib/gameConstants";

const KEYS = [
  "game.winInterval", "game.winPerStep",
  "game.jackpotScore", "game.jackpotMult",
  "game.jackpotBonusScore", "game.jackpotBonusMult",
] as const;

/**
 * readIntSettings — batch-read integer platform settings in ONE query.
 * DRY single source of truth: used by wallet route, session route, and any
 * future route that needs live admin-set game limits.
 * Non-fatal: returns fallbacks on any DB error.
 */
export async function readIntSettings(
  keys:      string[],
  fallbacks: Record<string, number>,
): Promise<Record<string, number>> {
  try {
    const rows = await db.platformSetting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, number> = {};
    for (const k of keys) {
      const row = rows.find(r => r.key === k);
      const v   = row ? parseInt(row.value, 10) : NaN;
      result[k] = isNaN(v) || v < 1 ? (fallbacks[k] ?? 0) : v;
    }
    return result;
  } catch {
    return Object.fromEntries(keys.map(k => [k, fallbacks[k] ?? 0]));
  }
}

/**
 * readLiveWagerLimits — convenience wrapper for the four wager/deposit limits.
 * Used by POST /api/game/session for server-side validation against live DB values.
 */
export async function readLiveWagerLimits() {
  const s = await readIntSettings(
    ["game.minDeposit", "game.minWager", "game.maxWager", "game.minWithdraw"],
    {
      "game.minDeposit":  GAME.MIN_DEPOSIT,
      "game.minWager":    GAME.MIN_WAGER,
      "game.maxWager":    GAME.MAX_WAGER,
      "game.minWithdraw": GAME.MIN_WITHDRAW,
    },
  );
  return {
    minDeposit:  s["game.minDeposit"],
    minWager:    s["game.minWager"],
    maxWager:    s["game.maxWager"],
    minWithdraw: s["game.minWithdraw"],
  };
}

/**
 * readLiveGameConfig — reads admin-set earning rules from platform_settings.
 * Falls back to env-backed GAME.* defaults if any row is missing or DB fails.
 * Non-fatal: never throws.
 */
export async function readLiveGameConfig(): Promise<LiveGameConfig> {
  try {
    const rows = await db.platformSetting.findMany({
      where: { key: { in: [...KEYS] } },
    });
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]));

    return {
      winInterval:       parseInt(map["game.winInterval"]       ?? String(GAME.WIN_INTERVAL),        10),
      winPerStep:        parseFloat(map["game.winPerStep"]       ?? String(GAME.WIN_PER_STEP)),
      jackpotScore:      parseInt(map["game.jackpotScore"]      ?? String(GAME.JACKPOT_SCORE),       10),
      jackpotMult:       parseFloat(map["game.jackpotMult"]      ?? String(GAME.JACKPOT_MULT)),
      jackpotBonusScore: parseInt(map["game.jackpotBonusScore"] ?? String(GAME.JACKPOT_BONUS_SCORE), 10),
      jackpotBonusMult:  parseFloat(map["game.jackpotBonusMult"] ?? String(GAME.JACKPOT_BONUS_MULT)),
    };
  } catch {
    return {
      winInterval:       GAME.WIN_INTERVAL,
      winPerStep:        GAME.WIN_PER_STEP,
      jackpotScore:      GAME.JACKPOT_SCORE,
      jackpotMult:       GAME.JACKPOT_MULT,
      jackpotBonusScore: GAME.JACKPOT_BONUS_SCORE,
      jackpotBonusMult:  GAME.JACKPOT_BONUS_MULT,
    };
  }
}
