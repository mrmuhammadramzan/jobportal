/**
 * GET /api/admin/applicants
 * Query params:
 *   job    — filter by jobId
 *   status — filter by ApplicationStatus enum value
 *   q      — search by applicant name (case-insensitive)
 *   limit  — max records to return (default: all)
 *
 * Returns applications with user profile + job + payment details.
 * Backend SOP Hard Rule 1: requireAdmin on every request.
 * Backend SOP Hard Rule 2: full error logging.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const { searchParams } = req.nextUrl;
    const jobId   = searchParams.get("job")    ?? "";
    const status  = searchParams.get("status") ?? "";
    const q       = searchParams.get("q")      ?? "";
    const limitRaw= searchParams.get("limit");
    const limit   = limitRaw ? parseInt(limitRaw, 10) : undefined;

    const applications = await db.application.findMany({
      where: {
        ...(jobId  ? { jobId }                                                 : {}),
        ...(status ? { status: status as never }                               : {}),
        ...(q      ? { user: { name: { contains: q } } }  : {}),
      },
      take:    limit,
      include: {
        user: {
          select: {
            id:      true,
            name:    true,
            email:   true,
            profile: { select: { phone: true, location: true } },
          },
        },
        job:     { select: { id: true, title: true, company: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      applications.map(a => ({
        id:            a.id,
        userId:        a.userId,
        applicantName: a.user.name,
        email:         a.user.email,
        phone:         a.user.profile?.phone    ?? "",
        location:      a.user.profile?.location ?? "",
        jobId:         a.job.id,
        jobTitle:      a.job.title,
        company:       a.job.company,
        cvUrl:         a.cvUrl,
        status:        a.status,
        appliedDate:   a.createdAt,
        payment:       a.payment
          ? {
              id:              a.payment.id,
              method:          a.payment.method,
              receiptUrl:      a.payment.receiptUrl,
              status:          a.payment.status,
              rejectionReason: a.payment.rejectionReason,
            }
          : null,
      }))
    );
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/applicants]", e);
    return NextResponse.json({ message: "Failed to load applicants." }, { status: 500 });
  }
}
