/**
 * GET /api/seeker/applications
 * Returns all applications for the authenticated seeker
 * with job info + payment status.
 *
 * Backend SOP Hard Rule 1: requireAuth — seeker only sees their own applications.
 * DRY: single endpoint, all data in one response.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    const applications = await db.application.findMany({
      where:   { userId: auth.id },
      include: {
        job: {
          select: {
            id:       true,
            title:    true,
            company:  true,
            location: true,
            type:     true,
          },
        },
        payment: {
          select: {
            status:         true,
            method:         true,
            receiptUrl:     true,
            rejectionReason:true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      applications.map(a => ({
        id:              a.id,
        jobId:           a.job.id,
        jobTitle:        a.job.title,
        company:         a.job.company,
        location:        a.job.location,
        type:            a.job.type,
        status:          a.status,
        appliedDate:     a.createdAt,
        paymentStatus:   a.payment?.status         ?? null,
        paymentMethod:   a.payment?.method         ?? null,
        rejectionReason: a.payment?.rejectionReason ?? null,
      }))
    );
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/seeker/applications]", e);
    return NextResponse.json({ message: "Failed to load applications." }, { status: 500 });
  }
}
