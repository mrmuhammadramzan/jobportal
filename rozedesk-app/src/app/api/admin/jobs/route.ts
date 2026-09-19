/**
 * GET  /api/admin/jobs — list all jobs with applicant counts (admin only)
 * POST /api/admin/jobs — create a new job listing (admin only)
 *
 * Backend SOP Hard Rule 1: requireAdmin on every method.
 * Backend SOP Hard Rule 2: all required fields validated server-side.
 * DRY: error helper defined once.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const jobs = await db.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
    return NextResponse.json(jobs.map(j => ({
      id:         j.id,
      title:      j.title,
      company:    j.company,
      category:   j.category,
      location:   j.location,
      type:       j.type,
      status:     j.status,
      salaryMin:  j.salaryMin,
      salaryMax:  j.salaryMax,
      deadline:   j.deadline,
      createdAt:  j.createdAt,
      applicants: j._count.applications,
    })));
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/jobs]", e);
    return NextResponse.json({ message: "Failed to load jobs." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const {
      title, company, location, type, category, description,
      requirements, benefits, salaryMin, salaryMax, deadline,
    } = body as Record<string, unknown>;

    /* Server-side validation */
    if (!String(title  ?? "").trim()) return err(400, "Job title is required.");
    if (!String(company?? "").trim()) return err(400, "Company name is required.");
    if (!String(location??"").trim()) return err(400, "Location is required.");
    if (!String(type   ?? "").trim()) return err(400, "Job type is required.");
    if (!String(category??"").trim()) return err(400, "Category is required.");
    if (!String(description??"").trim()) return err(400, "Description is required.");

    const job = await db.job.create({
      data: {
        title:        String(title).trim(),
        company:      String(company).trim(),
        location:     String(location).trim(),
        type:         String(type).trim(),
        category:     String(category).trim(),
        description:  String(description).trim(),
        requirements: Array.isArray(requirements) ? requirements : [],
        benefits:     Array.isArray(benefits)     ? benefits     : [],
        salaryMin:    salaryMin    ? Number(salaryMin)    : null,
        salaryMax:    salaryMax    ? Number(salaryMax)    : null,
        deadline:     deadline     ? new Date(String(deadline)) : null,
        status:       "ACTIVE",
      },
    });

    return NextResponse.json({
      id:        job.id,
      title:     job.title,
      company:   job.company,
      category:  job.category,
      location:  job.location,
      type:      job.type,
      status:    job.status,
      createdAt: job.createdAt,
      applicants: 0,
    }, { status: 201 });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/admin/jobs]", e);
    return NextResponse.json({ message: "Failed to create job." }, { status: 500 });
  }
}
