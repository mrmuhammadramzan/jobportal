/**
 * GET  /api/admin/game-withdrawals  — paginated list
 * PATCH /api/admin/game-withdrawals — approve or reject
 *
 * APPROVE: deducts wallet balance atomically, notifies user.
 * REJECT:  updates status only, notifies user with reason.
 *
 * Backend SOP Hard Rules:
 *  1 — requireAdmin
 *  6 — balance deduction + status update in a single $transaction callback
 *  §4.3 — already-reviewed deposits return 409 (idempotent guard)
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { createNotification } from "@/lib/notify";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "PENDING";
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit  = 20;

    const where = status === "ALL" ? {} : { status: status as never };

    const [withdrawals, total] = await Promise.all([
      db.gameWithdrawal.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip:    (page - 1) * limit,
        take:    limit,
        include: {
          wallet: { include: { user: { select: { id: true, name: true, email: true } } } },
        },
      }),
      db.gameWithdrawal.count({ where }),
    ]);

    return NextResponse.json({
      withdrawals: withdrawals.map(w => ({
        id:              w.id,
        userId:          w.userId,
        userName:        w.wallet.user.name,
        userEmail:       w.wallet.user.email,
        amount:          w.amount,
        method:          w.method,
        accountNumber:   w.accountNumber,
        accountName:     w.accountName,
        status:          w.status,
        rejectionReason: w.rejectionReason,
        submittedAt:     w.submittedAt,
        reviewedAt:      w.reviewedAt,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/game-withdrawals]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    const { withdrawalId, action, reason } = await req.json() as {
      withdrawalId?: string; action?: "APPROVE" | "REJECT"; reason?: string;
    };

    if (!withdrawalId || !action)
      return NextResponse.json({ message: "withdrawalId and action are required." }, { status: 400 });
    if (!["APPROVE", "REJECT"].includes(action))
      return NextResponse.json({ message: "action must be APPROVE or REJECT." }, { status: 400 });
    if (action === "REJECT" && !reason?.trim())
      return NextResponse.json({ message: "Rejection reason is required." }, { status: 400 });

    const withdrawal = await db.gameWithdrawal.findUnique({
      where:   { id: withdrawalId },
      include: { wallet: true },
    });
    if (!withdrawal)
      return NextResponse.json({ message: "Withdrawal not found." }, { status: 404 });
    if (withdrawal.status !== "PENDING")
      return NextResponse.json({ message: "Already reviewed." }, { status: 409 });

    if (action === "APPROVE") {
      /* Atomic: update status + deduct balance */
      await db.$transaction(async (tx) => {
        const wallet = await tx.gameWallet.findUnique({ where: { id: withdrawal.walletId } });
        if (!wallet || wallet.balance < withdrawal.amount)
          throw Object.assign(new Error("INSUFFICIENT_BALANCE"), { status: 402 });

        await tx.gameWithdrawal.update({
          where: { id: withdrawalId },
          data:  { status: "APPROVED", reviewedAt: new Date(), reviewedBy: admin.id },
        });
        await tx.gameWallet.update({
          where: { id: withdrawal.walletId },
          data:  { balance: { decrement: withdrawal.amount } },
        });
      });

      await createNotification({
        userId: withdrawal.userId,
        title:  "Withdrawal Approved",
        body:   `Your withdrawal of Rs. ${withdrawal.amount} has been approved. The amount will be sent to ${withdrawal.accountNumber} (${withdrawal.accountName}) shortly.`,
        type:   "success",
        link:   "/dashboard/history",
      });
    } else {
      await db.gameWithdrawal.update({
        where: { id: withdrawalId },
        data:  { status: "REJECTED", rejectionReason: reason!.trim(), reviewedAt: new Date(), reviewedBy: admin.id },
      });

      await createNotification({
        userId: withdrawal.userId,
        title:  "Withdrawal Rejected",
        body:   `Your withdrawal of Rs. ${withdrawal.amount} was rejected. Reason: ${reason}. Your balance was not affected.`,
        type:   "error",
        link:   "/dashboard/history",
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    const cast = e as Error & { status?: number };
    if (cast.status === 402) return NextResponse.json({ message: "Insufficient balance for approval." }, { status: 402 });
    console.error("[PATCH /api/admin/game-withdrawals]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
