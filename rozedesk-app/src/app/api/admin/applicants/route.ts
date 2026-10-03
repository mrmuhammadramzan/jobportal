/**
 * GET /api/admin/applicants
 * Query params:
 *   job    — filter by jobId
 *   status — filter by ApplicationStatus enum value
 *   q      — search by applicant name (case-insensitive)
 *   page   — page number, 1-based (default: 1)
 *   limit  — records per page (default: 50, max: 100)
 *
 * Returns paginated applications. receiptUrl is EXCLUDED from list responses
 * (it may be a large base64 string). Fetch the individual applicant detail
 * endpoint to get the full receipt when needed.
 *
 * Backend SOP Hard Rule 1: requireAdmin on every request.
 * Backend SOP Hard Rule 2: full error logging.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

const MAX_LIMIT = 100;
const DEF_LIMIT = 50;

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const { searchParams } = req.nextUrl;
    const jobId  = searchParams.get("job")    ?? "";
    const status = searchParams.get("status") ?? "";
    const q      = searchParams.get("q")      ?? "";
    const page   = Math.max(1, parseInt(searchParams.get("page")  ?? "1",  10));
    const limit  = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEF_LIMIT), 10)));
    const skip   = (page - 1) * limit;

    const where = {
      ...(jobId  ? { jobId }                            : {}),
      ...(status ? { status: status as never }          : {}),
      ...(q      ? { user: { name: { contains: q } } } : {}),
    };

    const [applications, total] = await Promise.all([
      db.application.findMany({
        where,
        skip,
        take: limit,
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
          payment: {
            select: {
              id:              true,
              method:          true,
              status:          true,
              amount:          true,
              rejectionReason: true,
              submittedAt:     true,
              // receiptUrl intentionally excluded — may be large base64; fetch detail endpoint for it
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.application.count({ where }),
    ]);

    return NextResponse.json({
      data: applications.map(a => ({
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
        payment:       a.payment ?? null,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/applicants]", e);
    return NextResponse.json({ message: "Failed to load applicants." }, { status: 500 });
  }
}
