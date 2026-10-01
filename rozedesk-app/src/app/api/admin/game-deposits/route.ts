/**
 * GET  /api/admin/game-deposits  — paginated list with status filter
 * PATCH /api/admin/game-deposits — approve or reject a deposit
 *
 * Admin SOP: requireAdmin enforces role check (Backend SOP §6.2).
 * Approving a deposit is a multi-write (deposit status + wallet balance)
 * wrapped in a DB transaction (Backend SOP Hard Rule 6).
 */
import { NextRequest, NextResponse } from "next/server";
import { db }                        from "@/lib/db";
import { requireAdmin }              from "@/lib/apiAuth";
import { createNotification }        from "@/lib/notify";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "PENDING";
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit  = 20;
    const skip   = (page - 1) * limit;

    const where = status === "ALL" ? {} : { status: status as never };

    const [deposits, total] = await Promise.all([
      db.gameDeposit.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
        include: {
          wallet: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      }),
      db.gameDeposit.count({ where }),
    ]);

    return NextResponse.json({
      deposits: deposits.map((d) => ({
        id:              d.id,
        userId:          d.userId,
        userName:        d.wallet.user.name,
        userEmail:       d.wallet.user.email,
        amount:          d.amount,
        method:          d.method,
        screenshotUrl:   d.screenshotUrl,
        status:          d.status,
        rejectionReason: d.rejectionReason,
        submittedAt:     d.submittedAt,
        reviewedAt:      d.reviewedAt,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/game-deposits]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = requireAdmin(req);

    const { depositId, action, reason } = await req.json() as {
      depositId?: string;
      action?:    "APPROVE" | "REJECT";
      reason?:    string;
    };

    if (!depositId || !action) {
      return NextResponse.json({ message: "depositId and action are required." }, { status: 400 });
    }
    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ message: "action must be APPROVE or REJECT." }, { status: 400 });
    }
    if (action === "REJECT" && !reason?.trim()) {
      return NextResponse.json({ message: "Rejection reason is required." }, { status: 400 });
    }

    const deposit = await db.gameDeposit.findUnique({
      where:   { id: depositId },
      include: { wallet: true },
    });

    if (!deposit) return NextResponse.json({ message: "Deposit not found." }, { status: 404 });
    if (deposit.status !== "PENDING") {
      return NextResponse.json({ message: "Deposit already reviewed." }, { status: 409 });
    }

    if (action === "APPROVE") {
      /* Approve: atomic deposit status + wallet credit — callback form required by MariaDB driver adapter */
      await db.$transaction(async (tx) => {
        await tx.gameDeposit.update({
          where: { id: depositId },
          data:  {
            status:     "APPROVED",
            reviewedAt: new Date(),
            reviewedBy: admin.id,
          },
        });
        await tx.gameWallet.update({
          where: { id: deposit.walletId },
          data:  { balance: { increment: deposit.amount } },
        });
      });

      await createNotification({
        userId: deposit.userId,
        title:  "Deposit Approved",
        body:   `Your game wallet deposit of Rs. ${deposit.amount} has been approved. Your balance has been updated.`,
        type:   "success",
        link:   "/dashboard/game",
      });
    } else {
      await db.gameDeposit.update({
        where: { id: depositId },
        data:  {
          status:          "REJECTED",
          rejectionReason: reason?.trim(),
          reviewedAt:      new Date(),
          reviewedBy:      admin.id,
        },
      });

      await createNotification({
        userId: deposit.userId,
        title:  "Deposit Rejected",
        body:   `Your game wallet deposit of Rs. ${deposit.amount} was rejected. Reason: ${reason}`,
        type:   "error",
        link:   "/dashboard/game",
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/admin/game-deposits]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
