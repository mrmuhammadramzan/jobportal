/**
 * GET /api/admin/payments
 * Returns all payment receipts with applicant + job info.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const payments = await db.payment.findMany({
      orderBy: { submittedAt: "desc" },
      include: {
        application: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            job:  { select: { id: true, title: true } },
          },
        },
      },
    });

    return NextResponse.json(payments.map(p => ({
      id:               p.id,
      applicantName:    p.application.user.name,
      applicantEmail:   p.application.user.email,
      jobTitle:         p.application.job.title,
      jobId:            p.application.job.id,
      method:           p.method,
      amount:           p.amount,
      receiptUrl:       p.receiptUrl,
      receiptRef:       p.receiptRef,
      status:           p.status,
      rejectionReason:  p.rejectionReason,
      submittedAt:      p.submittedAt,
      reviewedAt:       p.reviewedAt,
    })));
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/payments]", e);
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}
