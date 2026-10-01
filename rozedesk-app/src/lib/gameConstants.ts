/**
 * gameConstants.ts — Game business rules: env-backed constants + pure calculation.
 *
 * SAFE FOR CLIENT — no Node.js imports, no DB access.
 * Import this file from both client components and server code.
 *
 * For DB-backed live config (admin-set values) use:
 *   import { readLiveGameConfig } from "@/lib/gameConfig.server"
 * — that file is server-only and must NEVER be imported by client components.
 *
 * DRY Hard Rule 2: every numeric business rule defined once here.
 */

/**
 * BRAND — single source of truth for platform identity.
 * All auth pages, NavBar, and marketing copy consume these values.
 * Override via env vars so staging/prod can differ without code changes.
 */
export const BRAND = {
  name:      process.env.NEXT_PUBLIC_BRAND_NAME      ?? "HUNT",
  logoSrc:   process.env.NEXT_PUBLIC_BRAND_LOGO_SRC  ?? "/assets/branding/hunt-icon.png",
  logoFull:  process.env.NEXT_PUBLIC_BRAND_LOGO_FULL ?? "/assets/branding/hunt-logo.png",
  logoAlt:   process.env.NEXT_PUBLIC_BRAND_NAME      ?? "HUNT",
  tagline:   process.env.NEXT_PUBLIC_BRAND_TAGLINE   ?? "Track the eagle. Secure your reward.",
} as const;

export const GAME = {
  MIN_DEPOSIT:        parseInt(process.env.GAME_MIN_DEPOSIT         ?? "120",  10),
  MIN_WAGER:          parseInt(process.env.GAME_MIN_WAGER           ?? "120",  10),
  MAX_WAGER:          parseInt(process.env.GAME_MAX_WAGER           ?? "10000", 10),
  MIN_WITHDRAW:       parseInt(process.env.GAME_MIN_WITHDRAW        ?? "200",  10),
  WIN_INTERVAL:       parseInt(process.env.GAME_WIN_INTERVAL        ?? "100",  10),
  WIN_PER_STEP:       parseInt(process.env.GAME_WIN_PER_STEP        ?? "10",   10),
  JACKPOT_SCORE:      parseInt(process.env.GAME_JACKPOT_SCORE       ?? "1000", 10),
  JACKPOT_MULT:       parseFloat(process.env.GAME_JACKPOT_MULT      ?? "1.0"),
  JACKPOT_BONUS_SCORE:parseInt(process.env.GAME_JACKPOT_BONUS_SCORE ?? "1200", 10),
  JACKPOT_BONUS_MULT: parseFloat(process.env.GAME_JACKPOT_BONUS_MULT ?? "1.2"),
} as const;

/** Live config shape returned by the wallet API and used by calculateWinnings(). */
export interface LiveGameConfig {
  winInterval:       number;
  winPerStep:        number;
  jackpotScore:      number;
  jackpotMult:       number;
  jackpotBonusScore: number;
  jackpotBonusMult:  number;
}

/**
 * calculateWinnings — milestone-based payout (legacy / kept for reference).
 * NOT used by the crash game. Retained so existing imports don't break.
 */
export function calculateWinnings(
  wager: number,
  score: number,
  cfg:   LiveGameConfig,
): { milestoneWin: number; jackpotWin: number; totalWin: number; milestones: number[] } {
  const milestones: number[] = [];
  let milestoneWin = 0;
  const steps = Math.floor(score / cfg.winInterval);
  for (let i = 1; i <= steps; i++) {
    milestones.push(i * cfg.winInterval);
    milestoneWin += cfg.winPerStep;
  }
  let jackpotWin = 0;
  if (score >= cfg.jackpotBonusScore) {
    jackpotWin = Math.round(wager * cfg.jackpotBonusMult);
  } else if (score >= cfg.jackpotScore) {
    jackpotWin = Math.round(wager * cfg.jackpotMult);
  }
  return { milestoneWin, jackpotWin, totalWin: milestoneWin + jackpotWin, milestones };
}

/**
 * calculateCrashWin — HUNT crash-game payout.
 *
 * Economy: score = Math.floor(multiplier × 100)
 *   → multiplier = score / 100
 *   → winAmount  = Math.round(wager × multiplier)
 *
 * Examples:
 *   wager=120, score=200 (2.00×) → Rs. 240
 *   wager=120, score=150 (1.50×) → Rs. 180
 *   wager=500, score=350 (3.50×) → Rs. 1750
 *
 * Returns 0 when score < minWinScore (bird escaped before cashout threshold).
 * minWinScore defaults to 100 (1.00× — break-even); admin can raise it via
 * game.minWinScore setting so house always wins below a configured floor.
 */
export function calculateCrashWin(
  wager:        number,
  score:        number,
  minWinScore = 100,          /* 1.00× break-even floor */
): { winAmount: number; multiplier: number } {
  if (score < minWinScore) return { winAmount: 0, multiplier: score / 100 };
  const multiplier = score / 100;
  const winAmount  = Math.round(wager * multiplier);
  return { winAmount, multiplier };
}
