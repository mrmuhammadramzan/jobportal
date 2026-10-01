/**
 * POST /api/admin/payments/[id]/reset
 * Resets a payment and its application back to PENDING_PAYMENT
 * so the applicant can resubmit their receipt.
 * Used when a receipt was broken/missing (e.g. file storage issue).
 *
 * Next.js 16: params is a Promise — must be awaited.
 * Backend SOP Hard Rule 1: requireAdmin.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(req);
    const { id } = await params;

    const payment = await db.payment.findUnique({
      where:   { id },
      include: { application: true },
    });
    if (!payment) return NextResponse.json({ message: "Payment not found." }, { status: 404 });

    /* Reset atomically — callback form required by MariaDB driver adapter */
    await db.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id } });
      await tx.application.update({
        where: { id: payment.applicationId },
        data:  { status: "PENDING_PAYMENT" },
      });
    });

    return NextResponse.json({ message: "Reset. Applicant can resubmit." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/admin/payments/[id]/reset]", e);
    return NextResponse.json({ message: "Failed to reset." }, { status: 500 });
  }
}
