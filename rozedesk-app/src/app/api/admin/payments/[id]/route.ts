/**
 * PATCH /api/admin/payments/[id] — approve or reject a payment receipt.
 * On APPROVED: sets application to CV_UNDER_REVIEW + sends approval email.
 * On REJECTED: sets application to PAYMENT_REJECTED + sends rejection email.
 * Both DB updates are atomic. Email is non-fatal.
 * Next.js 16: params is a Promise — must be awaited.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { createNotification } from "@/lib/notify";
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from "@/lib/mailer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin              = requireAdmin(req);
    const { id }             = await params;
    const { status, reason } = await req.json() as { status: "APPROVED" | "REJECTED"; reason?: string };

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    const payment = await db.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id },
        data: {
          status,
          rejectionReason: reason ?? null,
          reviewedAt:      new Date(),
          reviewedBy:      admin.id,
        },
        include: {
          application: {
            include: {
              user: { select: { name: true, email: true } },
              job:  { select: { title: true, company: true } },
            },
          },
        },
      });

      const newAppStatus = status === "APPROVED" ? "CV_UNDER_REVIEW" : "PAYMENT_REJECTED";
      await tx.application.update({
        where: { id: updated.applicationId },
        data:  { status: newAppStatus },
      });

      return updated;
    });

    /* Send notification email + in-app notification — both non-fatal */
    const { user, job } = payment.application;
    if (status === "APPROVED") {
      sendPaymentApprovedEmail(user.email, user.name, job.title, job.company)
        .catch(e => console.error("[payments] Approval email failed:", e.message));
      createNotification({
        userId: payment.application.userId ?? "",
        title:  "Payment Approved ✓",
        body:   `Your payment for "${job.title}" at ${job.company} has been verified. Your CV is now under review.`,
        type:   "success",
        link:   "/dashboard/applications",
      });
    } else {
      sendPaymentRejectedEmail(user.email, user.name, job.title, reason ?? "Receipt could not be verified.")
        .catch(e => console.error("[payments] Rejection email failed:", e.message));
      createNotification({
        userId: payment.application.userId ?? "",
        title:  "Payment Not Accepted",
        body:   `Your payment receipt for "${job.title}" was not accepted. Reason: ${reason ?? "Receipt could not be verified."}`,
        type:   "error",
        link:   "/dashboard/applications",
      });
    }

    return NextResponse.json(payment);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/admin/payments/[id]]", e);
    return NextResponse.json({ message: "Failed to update payment." }, { status: 500 });
  }
}
