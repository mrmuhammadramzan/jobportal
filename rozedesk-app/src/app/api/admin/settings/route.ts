/**
 * GET /api/admin/settings  — load all settings (profile + platform)
 * PUT /api/admin/settings  — save platform settings (siteName, tagline, etc.)
 *
 * Backend SOP Hard Rule 1: requireAdmin on every method.
 * DRY: platform settings stored as key-value in platform_settings table.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);

    /* Load admin user profile */
    const admin = await db.user.findUnique({
      where:  { id: auth.id },
      select: { id: true, name: true, email: true },
    });

    /* Load platform settings */
    let platform = {
      siteName:       "FlappyWin",
      tagline:        "Play Flappy Bird & Earn Real PKR",
      contactEmail:   "hello@flappywin.com",
      notifNew:       true,
      notifShortlist: true,
      notifWeekly:    false,
      appFee:         parseInt(process.env.APP_FEE_PKR ?? "150", 10),
      platformCut:    parseInt(process.env.PLATFORM_CUT_PCT ?? "15", 10),
      /* Game-specific settings — controllable from admin panel */
      gameMinDeposit: parseInt(process.env.GAME_MIN_DEPOSIT ?? "120", 10),
      gameMinWager:   parseInt(process.env.GAME_MIN_WAGER   ?? "120", 10),
    };

    try {
      const rows = await db.platformSetting.findMany();
      const kv   = Object.fromEntries(rows.map(r => [r.key, r.value]));
      platform = {
        siteName:       kv.siteName       ?? platform.siteName,
        tagline:        kv.tagline        ?? platform.tagline,
        contactEmail:   kv.contactEmail   ?? platform.contactEmail,
        notifNew:       kv.notifNew       !== "false",
        notifShortlist: kv.notifShortlist !== "false",
        notifWeekly:    kv.notifWeekly    === "true",
        appFee:         kv.appFee         ? parseInt(kv.appFee,         10) : platform.appFee,
        platformCut:    kv.platformCut    ? parseInt(kv.platformCut,    10) : platform.platformCut,
        gameMinDeposit: kv["game.minDeposit"] ? parseInt(kv["game.minDeposit"], 10) : platform.gameMinDeposit,
        gameMinWager:   kv["game.minWager"]   ? parseInt(kv["game.minWager"],   10) : platform.gameMinWager,
      };
    } catch {
      /* Table not yet created — return defaults */
    }

    return NextResponse.json({
      profile: admin,
      platform,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/settings]", e);
    return NextResponse.json({ message: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as {
      siteName?: string; tagline?: string; contactEmail?: string;
      notifNew?: boolean; notifShortlist?: boolean; notifWeekly?: boolean;
      appFee?: number; platformCut?: number;
      gameMinDeposit?: number; gameMinWager?: number;
    };

    const updates: { key: string; value: string }[] = [];
    if (body.siteName      !== undefined) updates.push({ key: "siteName",      value: body.siteName });
    if (body.tagline       !== undefined) updates.push({ key: "tagline",       value: body.tagline });
    if (body.contactEmail  !== undefined) updates.push({ key: "contactEmail",  value: body.contactEmail });
    if (body.notifNew      !== undefined) updates.push({ key: "notifNew",      value: String(body.notifNew) });
    if (body.notifShortlist!== undefined) updates.push({ key: "notifShortlist",value: String(body.notifShortlist) });
    if (body.notifWeekly   !== undefined) updates.push({ key: "notifWeekly",   value: String(body.notifWeekly) });
    if (body.appFee !== undefined) {
      const fee = parseInt(String(body.appFee), 10);
      if (isNaN(fee) || fee < 1) return NextResponse.json({ message: "Application fee must be a positive number." }, { status: 400 });
      updates.push({ key: "appFee", value: String(fee) });
    }
    if (body.platformCut !== undefined) {
      const cut = parseInt(String(body.platformCut), 10);
      if (isNaN(cut) || cut < 0 || cut > 99) return NextResponse.json({ message: "Platform cut must be 0–99%." }, { status: 400 });
      updates.push({ key: "platformCut", value: String(cut) });
    }
    if (body.gameMinDeposit !== undefined) {
      const v = parseInt(String(body.gameMinDeposit), 10);
      if (isNaN(v) || v < 1) return NextResponse.json({ message: "Min deposit must be a positive number." }, { status: 400 });
      updates.push({ key: "game.minDeposit", value: String(v) });
    }
    if (body.gameMinWager !== undefined) {
      const v = parseInt(String(body.gameMinWager), 10);
      if (isNaN(v) || v < 1) return NextResponse.json({ message: "Min wager must be a positive number." }, { status: 400 });
      updates.push({ key: "game.minWager", value: String(v) });
    }

    /* Upsert each setting — graceful if table doesn't exist yet */
    await Promise.all(updates.map(u =>
      db.platformSetting.upsert({
        where:  { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      }).catch(e => console.warn(`[settings PUT] skipping ${u.key}: table may not exist yet —`, e.message))
    ));

    return NextResponse.json({ message: "Platform settings saved." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/admin/settings]", e);
    return NextResponse.json({ message: "Failed to save settings." }, { status: 500 });
  }
}
