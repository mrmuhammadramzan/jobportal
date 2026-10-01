/**
 * GET  /api/admin/game-settings — load all dynamic game config
 * PUT  /api/admin/game-settings — save all dynamic game config
 *
 * All settings stored in platform_settings (key-value table).
 * Env vars are used as build-time defaults; DB always wins at runtime.
 *
 * Config schema (all keys prefixed "game."):
 *   game.winInterval     — score interval for milestone reward (default 100)
 *   game.winPerStep      — PKR earned per milestone           (default 10)
 *   game.jackpotScore    — score to recover wager             (default 1000)
 *   game.jackpotMult     — wager multiplier at jackpot        (default 1.0)
 *   game.jackpotBonusScore  — score for profit                (default 1200)
 *   game.jackpotBonusMult   — profit multiplier               (default 1.2)
 *   game.baseSpeed       — pipe speed (px/frame)              (default 2.4)
 *   game.gravity         — gravity per frame                  (default 0.45)
 *   game.jumpVel         — bird jump velocity                 (default -8.5)
 *   game.pipeGap         — vertical gap between pipes         (default 148)
 *   game.randomSpeed     — "true"/"false" enable random speed (default false)
 *   game.randomThreshold — score to start random speed        (default 10)
 *   game.randomSpeedMin  — minimum pipe speed when random     (default 1.8)
 *   game.randomSpeedMax  — maximum pipe speed when random     (default 4.5)
 *   game.biasMode        — "none" | "win" | "loss"           (default none)
 *   game.minDeposit      — minimum deposit PKR               (default 120)
 *   game.minWager        — minimum wager PKR                 (default 120)
 *   game.maxWager        — maximum wager PKR                 (default 10000)
 *   game.minWithdraw     — minimum withdrawal PKR            (default 200)
 *
 * Backend SOP Hard Rule 1: requireAdmin on every request.
 * DRY: DEFAULTS map defined once, referenced in both GET and PUT.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

/* ── Single source of defaults — env-backed (DRY) ── */
const DEFAULTS: Record<string, string> = {
  "game.winInterval":      process.env.GAME_WIN_INTERVAL       ?? "100",
  "game.winPerStep":       process.env.GAME_WIN_PER_STEP       ?? "10",
  "game.jackpotScore":     process.env.GAME_JACKPOT_SCORE      ?? "1000",
  "game.jackpotMult":      process.env.GAME_JACKPOT_MULT       ?? "1.0",
  "game.jackpotBonusScore":process.env.GAME_JACKPOT_BONUS_SCORE ?? "1200",
  "game.jackpotBonusMult": process.env.GAME_JACKPOT_BONUS_MULT ?? "1.2",
  "game.baseSpeed":        process.env.GAME_BASE_SPEED         ?? "2.4",
  "game.gravity":          process.env.GAME_GRAVITY            ?? "0.45",
  "game.jumpVel":          process.env.GAME_JUMP_VEL           ?? "-8.5",
  "game.pipeGap":          process.env.GAME_PIPE_GAP           ?? "148",
  "game.randomSpeed":      process.env.GAME_RANDOM_SPEED       ?? "false",
  "game.randomThreshold":  process.env.GAME_RANDOM_THRESHOLD   ?? "10",
  "game.randomSpeedMin":   process.env.GAME_RANDOM_SPEED_MIN   ?? "1.8",
  "game.randomSpeedMax":   process.env.GAME_RANDOM_SPEED_MAX   ?? "4.5",
  "game.biasMode":         process.env.GAME_BIAS_MODE          ?? "none",
  "game.minDeposit":       process.env.GAME_MIN_DEPOSIT        ?? "120",
  "game.minWager":         process.env.GAME_MIN_WAGER          ?? "120",
  "game.maxWager":         process.env.GAME_MAX_WAGER          ?? "10000",
  "game.minWithdraw":      process.env.GAME_MIN_WITHDRAW       ?? "200",
  "game.escapeMin":        process.env.GAME_ESCAPE_MIN         ?? "1.1",
  "game.escapeMax":        process.env.GAME_ESCAPE_MAX         ?? "12",
};

const GAME_KEYS = Object.keys(DEFAULTS);

async function loadSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.platformSetting.findMany({
      where: { key: { in: GAME_KEYS } },
    });
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
    /* Merge DB over defaults */
    return Object.fromEntries(
      GAME_KEYS.map(k => [k.replace("game.", ""), map[k] ?? DEFAULTS[k]])
    );
  } catch {
    return Object.fromEntries(
      GAME_KEYS.map(k => [k.replace("game.", ""), DEFAULTS[k]])
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const raw = await loadSettings();

    /* Parse typed values — everything in DB is stored as string */
    return NextResponse.json({
      winInterval:       parseInt(raw.winInterval,       10),
      winPerStep:        parseFloat(raw.winPerStep),
      jackpotScore:      parseInt(raw.jackpotScore,      10),
      jackpotMult:       parseFloat(raw.jackpotMult),
      jackpotBonusScore: parseInt(raw.jackpotBonusScore, 10),
      jackpotBonusMult:  parseFloat(raw.jackpotBonusMult),
      baseSpeed:         parseFloat(raw.baseSpeed),
      gravity:           parseFloat(raw.gravity),
      jumpVel:           parseFloat(raw.jumpVel),
      pipeGap:           parseInt(raw.pipeGap,           10),
      randomSpeed:       raw.randomSpeed === "true",     /* boolean, not string */
      randomThreshold:   parseInt(raw.randomThreshold,   10),
      randomSpeedMin:    parseFloat(raw.randomSpeedMin),
      randomSpeedMax:    parseFloat(raw.randomSpeedMax),
      biasMode:          raw.biasMode as "none" | "win" | "loss",
      minDeposit:        parseInt(raw.minDeposit,        10),
      minWager:          parseInt(raw.minWager,          10),
      maxWager:          parseInt(raw.maxWager,          10),
      minWithdraw:       parseInt(raw.minWithdraw,       10),
      escapeMin:         parseFloat(raw.escapeMin),
      escapeMax:         parseFloat(raw.escapeMax),
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/game-settings]", e);
    return NextResponse.json({ message: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as Record<string, string | number | boolean>;

    /* Validate and upsert only known keys */
    const updates = Object.entries(body)
      .filter(([k]) => GAME_KEYS.includes(`game.${k}`))
      .map(([k, v]) => ({
        key:      `game.${k}`,
        value:    String(v),
        updatedAt: new Date(),
      }));

    if (!updates.length)
      return NextResponse.json({ message: "No valid fields." }, { status: 400 });

    /* Upsert each setting atomically */
    await db.$transaction(
      updates.map(u =>
        db.platformSetting.upsert({
          where:  { key: u.key },
          create: { key: u.key, value: u.value, updatedAt: u.updatedAt },
          update: { value: u.value, updatedAt: u.updatedAt },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/admin/game-settings]", e);
    return NextResponse.json({ message: "Failed to save settings." }, { status: 500 });
  }
}
