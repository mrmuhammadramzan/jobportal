/**
 * POST /api/game/withdraw
 * Body: { amount, method, accountNumber, accountName }
 *
 * User submits a withdrawal request. Admin must approve before balance deducts.
 * Balance is NOT deducted on submit — only on admin approval (prevents race).
 *
 * Backend SOP Hard Rules:
 *  1 — requireAuth, never trust client
 *  5 — amount validated server-side against DB-backed minWithdraw (not env constant)
 *  6 — wallet read + withdrawal create in one transaction (atomic)
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";
import { GAME }        from "@/lib/gameConstants";

const ALLOWED_METHODS = new Set(["JAZZCASH", "EASYPAISA"]);

/** Read a single integer platform setting — same helper pattern as wallet route. */
async function getIntSetting(key: string, fallback: number): Promise<number> {
  try {
    const row = await db.platformSetting.findUnique({ where: { key } });
    const v   = row ? parseInt(row.value, 10) : NaN;
    return isNaN(v) || v < 1 ? fallback : v;
  } catch {
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const body = await req.json() as {
      amount?: number; method?: string;
      accountNumber?: string; accountName?: string;
    };

    /* ── Read live minimum from DB — admin-configurable, not env-locked ── */
    const minWithdraw = await getIntSetting("game.minWithdraw", GAME.MIN_WITHDRAW);

    const { amount, method, accountNumber, accountName } = body;

    /* ── Validation ── */
    if (!amount || typeof amount !== "number" || !Number.isInteger(amount) || amount < minWithdraw)
      return NextResponse.json({ message: `Minimum withdrawal is Rs. ${minWithdraw}.` }, { status: 400 });
    if (!method || !ALLOWED_METHODS.has(method.toUpperCase()))
      return NextResponse.json({ message: "Invalid payment method." }, { status: 400 });
    if (!accountNumber?.trim())
      return NextResponse.json({ message: "Account number is required." }, { status: 400 });
    if (!accountName?.trim())
      return NextResponse.json({ message: "Account name is required." }, { status: 400 });

    /* Basic format: Pakistani mobile numbers (JazzCash/Easypaisa are always mobile accounts) */
    const normAccount = accountNumber.trim().replace(/[\s\-]/g, "");
    if (!/^03\d{9}$/.test(normAccount))
      return NextResponse.json({ message: "Account number must be a valid Pakistani mobile number (03XXXXXXXXX)." }, { status: 400 });

    /* ── Atomic: verify balance + create request ── */
    const withdrawal = await db.$transaction(async (tx) => {
      const wallet = await tx.gameWallet.findUnique({ where: { userId: auth.id } });
      if (!wallet)
        throw Object.assign(new Error("WALLET_NOT_FOUND"), { status: 404 });
      if (wallet.balance < amount)
        throw Object.assign(new Error("INSUFFICIENT_BALANCE"), { status: 402 });

      return tx.gameWithdrawal.create({
        data: {
          walletId:      wallet.id,
          userId:        auth.id,
          amount,
          method:        method.toUpperCase(),
          accountNumber: normAccount,
          accountName:   accountName.trim(),
          status:        "PENDING",
        },
      });
    });

    /* ── Notify admins ── */
    const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    await Promise.allSettled(admins.map(a =>
      db.notification.create({ data: {
        userId: a.id,
        title:  "New Withdrawal Request",
        body:   `A player requested Rs. ${amount} withdrawal via ${method}.`,
        type:   "payment",
        link:   "/admin/withdrawals",
      }}),
    ));

    return NextResponse.json({ withdrawalId: withdrawal.id, status: "PENDING" }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    const cast = e as Error & { status?: number };
    if (cast.status === 404) return NextResponse.json({ message: "Wallet not found." }, { status: 404 });
    if (cast.status === 402) return NextResponse.json({ message: "Insufficient balance." }, { status: 402 });
    console.error("[POST /api/game/withdraw]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
