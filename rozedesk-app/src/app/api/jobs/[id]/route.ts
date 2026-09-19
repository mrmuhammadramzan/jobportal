/**
 * GET /api/jobs/[id] — public single job detail
 * Next.js 16: params is a Promise — must be awaited.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await db.job.findUnique({
      where:   { id },
      include: { _count: { select: { applications: true } } },
    });
    if (!job || job.status === "DRAFT") {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }
    return NextResponse.json({ ...job, applicants: job._count.applications });
  } catch (e) {
    console.error("[GET /api/jobs/[id]]", e);
    return NextResponse.json({ message: "Failed to load job." }, { status: 500 });
  }
}
