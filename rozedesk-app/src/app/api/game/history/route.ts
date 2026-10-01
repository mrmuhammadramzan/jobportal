/**
 * GET /api/game/history
 * Returns the user's complete financial history:
 *   deposits[]   — all deposit requests (any status)
 *   withdrawals[] — all withdrawal requests (any status)
 *   sessions[]   — last 20 completed game sessions
 *
 * Used by /dashboard/history page.
 * Backend SOP §6.1: requireAuth, no admin check.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    const wallet = await db.gameWallet.findUnique({ where: { userId: auth.id } });
    if (!wallet) return NextResponse.json({ deposits: [], withdrawals: [], sessions: [] });

    const [deposits, withdrawals, sessions] = await Promise.all([
      db.gameDeposit.findMany({
        where:   { walletId: wallet.id },
        orderBy: { submittedAt: "desc" },
        select: { id: true, amount: true, method: true, status: true, submittedAt: true, rejectionReason: true },
      }),
      db.gameWithdrawal.findMany({
        where:   { walletId: wallet.id },
        orderBy: { submittedAt: "desc" },
        select: { id: true, amount: true, method: true, accountNumber: true, accountName: true, status: true, submittedAt: true, rejectionReason: true },
      }),
      db.gameSession.findMany({
        where:   { walletId: wallet.id, completed: true },
        orderBy: { endedAt: "desc" },
        take:    20,
        select: { id: true, wagerAmount: true, finalScore: true, winAmount: true, startedAt: true, endedAt: true },
      }),
    ]);

    return NextResponse.json({ deposits, withdrawals, sessions });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[GET /api/game/history]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
