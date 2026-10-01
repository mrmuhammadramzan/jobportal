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
