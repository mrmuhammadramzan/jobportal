/**
 * GET    /api/seeker/saved-jobs — list saved jobs
 * POST   /api/seeker/saved-jobs — save a job { jobId }
 * DELETE /api/seeker/saved-jobs — unsave { jobId }
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth  = requireAuth(req);
    const saved = await db.savedJob.findMany({
      where:   { userId: auth.id },
      include: { job: { select: { id: true, title: true, company: true, location: true, type: true } } },
      orderBy: { savedAt: "desc" },
    });
    return NextResponse.json(saved.map(s => ({
      id:      s.id,
      jobId:   s.job.id,
      title:   s.job.title,
      company: s.job.company,
      location:s.job.location,
      type:    s.job.type,
      savedAt: s.savedAt,
    })));
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth  = requireAuth(req);
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ message: "jobId required." }, { status: 400 });

    const saved = await db.savedJob.upsert({
      where:  { userId_jobId: { userId: auth.id, jobId } },
      create: { userId: auth.id, jobId },
      update: {},
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth  = requireAuth(req);
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ message: "jobId required." }, { status: 400 });

    await db.savedJob.deleteMany({ where: { userId: auth.id, jobId } });
    return NextResponse.json({ message: "Removed." });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}
