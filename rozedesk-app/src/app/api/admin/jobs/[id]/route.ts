/**
 * GET    /api/admin/jobs/[id]  — get single job
 * PUT    /api/admin/jobs/[id]  — update all fields
 * PATCH  /api/admin/jobs/[id]  — update status only (ACTIVE | CLOSED | DRAFT)
 * DELETE /api/admin/jobs/[id]  — permanently delete
 *
 * Next.js 16: params is a Promise — must be awaited.
 * Backend SOP Hard Rule 1: requireAdmin on every method.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

type Ctx = { params: Promise<{ id: string }> };

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const job = await db.job.findUnique({ where: { id } });
    if (!job) return err(404, "Job not found.");
    return NextResponse.json(job);
  } catch (e) {
    if (e instanceof Response) return e;
    return err(500, "Failed to load job.");
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const body = await req.json();

    if (!String(body.title   ?? "").trim()) return err(400, "Title is required.");
    if (!String(body.company ?? "").trim()) return err(400, "Company is required.");
    if (!String(body.location?? "").trim()) return err(400, "Location is required.");

    const job = await db.job.update({
      where: { id },
      data: {
        title:        String(body.title).trim(),
        company:      String(body.company ?? "").trim(),
        location:     String(body.location).trim(),
        type:         body.type,
        category:     body.category,
        description:  body.description,
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        benefits:     Array.isArray(body.benefits)     ? body.benefits     : [],
        salaryMin:    body.salaryMin ? Number(body.salaryMin) : null,
        salaryMax:    body.salaryMax ? Number(body.salaryMax) : null,
        deadline:     body.deadline  ? new Date(body.deadline) : null,
      },
    });
    return NextResponse.json(job);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/admin/jobs/[id]]", e);
    return err(500, "Failed to update job.");
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    requireAdmin(req);
    const { id }    = await params;
    const { status } = await req.json() as { status?: string };

    const VALID = ["ACTIVE", "CLOSED", "DRAFT"];
    if (!status || !VALID.includes(status)) {
      return err(400, `status must be one of: ${VALID.join(", ")}`);
    }

    const job = await db.job.update({
      where: { id },
      data:  { status: status as "ACTIVE" | "CLOSED" | "DRAFT" },
    });
    return NextResponse.json({ id: job.id, status: job.status });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/admin/jobs/[id]]", e);
    return err(500, "Failed to update job status.");
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    requireAdmin(req);
    const { id } = await params;
    await db.job.delete({ where: { id } });
    return NextResponse.json({ message: "Job deleted." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[DELETE /api/admin/jobs/[id]]", e);
    return err(500, "Failed to delete job.");
  }
}
