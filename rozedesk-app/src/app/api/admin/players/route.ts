/**
 * GET   /api/admin/players        — paginated player list with stats
 * PATCH /api/admin/players        — block/unblock or adjust balance
 *
 * Backend SOP Hard Rule 1: requireAdmin.
 * Backend SOP Hard Rule 6: balance adjustment atomic (transaction).
 * Security: balance adjustment validated server-side (no negative balance allowed).
 *
 * GET query params:
 *   page=1, limit=20, q=search, status=all|active|blocked
 *
 * PATCH body:
 *   { userId, action: "block"|"unblock"|"adjustBalance", amount?: number }
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { createNotification } from "@/lib/notify";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const q      = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all"; /* all | active | blocked */

    const where = {
      role: "SEEKER" as const,
      ...(q ? {
        OR: [
          { name:  { contains: q } },
          { email: { contains: q } },
        ],
      } : {}),
      ...(status === "blocked" ? { blocked: true  } : {}),
      ...(status === "active"  ? { blocked: false } : {}),
    };

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true,
          blocked: true, createdAt: true,
          gameWallet: {
            select: {
              balance: true,
              _count:  { select: { sessions: true, deposits: true } },
              sessions: {
                where:   { completed: true },
                select:  { winAmount: true },
              },
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      players: users.map(u => {
        const wallet    = u.gameWallet;
        const earned    = wallet?.sessions.reduce((s, g) => s + g.winAmount, 0) ?? 0;
        return {
          id:        u.id,
          name:      u.name,
          email:     u.email,
          blocked:   u.blocked ?? false,
          createdAt: u.createdAt,
          balance:   wallet?.balance    ?? 0,
          totalEarned:   earned,
          gamesPlayed:   wallet?._count.sessions  ?? 0,
          depositsCount: wallet?._count.deposits  ?? 0,
        };
      }),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/players]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    const { userId, action, amount } = await req.json() as {
      userId?:  string;
      action?:  "block" | "unblock" | "adjustBalance";
      amount?:  number;
    };

    if (!userId || !action)
      return NextResponse.json({ message: "userId and action are required." }, { status: 400 });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true, gameWallet: { select: { id: true, balance: true } } },
    });
    if (!user)
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    if (user.role === "ADMIN")
      return NextResponse.json({ message: "Cannot modify admin accounts." }, { status: 403 });

    if (action === "block" || action === "unblock") {
      await db.user.update({
        where: { id: userId },
        data:  { blocked: action === "block" },
      });

      await createNotification({
        userId,
        title: action === "block" ? "Account Suspended" : "Account Reactivated",
        body:  action === "block"
          ? "Your account has been suspended by an administrator. Contact support."
          : "Your account has been reactivated. You can play again.",
        type: action === "block" ? "error" : "success",
        link: "/dashboard",
      });

      return NextResponse.json({ success: true });
    }

    if (action === "adjustBalance") {
      if (typeof amount !== "number" || isNaN(amount))
        return NextResponse.json({ message: "amount must be a number." }, { status: 400 });

      if (!user.gameWallet)
        return NextResponse.json({ message: "Player has no wallet yet." }, { status: 404 });

      const newBalance = user.gameWallet.balance + amount;
      if (newBalance < 0)
        return NextResponse.json({ message: `Cannot set balance below 0 (current: ${user.gameWallet.balance}).` }, { status: 400 });

      await db.$transaction(async (tx) => {
        await tx.gameWallet.update({
          where: { id: user.gameWallet!.id },
          data:  { balance: { increment: amount } },
        });
      });

      if (amount !== 0) {
        await createNotification({
          userId,
          title: amount > 0 ? "Balance Added" : "Balance Deducted",
          body:  amount > 0
            ? `Rs. ${amount} has been added to your wallet by admin.`
            : `Rs. ${Math.abs(amount)} has been deducted from your wallet by admin.`,
          type: amount > 0 ? "success" : "warning",
          link: "/dashboard/wallet",
        });
      }

      return NextResponse.json({ success: true, newBalance });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/admin/players]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
