/**
 * GET /api/admin/cv/[userId]
 * Returns full CV data for a seeker — used by admin to view applicant's CV.
 *
 * Next.js 16: params is a Promise — must be awaited.
 * Backend SOP Hard Rule 1: requireAdmin — only admin can view seeker profiles.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    requireAdmin(req);
    const { userId } = await params;

    const user = await db.user.findUnique({
      where:   { id: userId },
      include: { profile: true },
    });
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const p = user.profile;
    return NextResponse.json({
      name:           user.name,
      email:          user.email,
      phone:          p?.phone          ?? "",
      location:       p?.location       ?? "",
      summary:        p?.summary        ?? "",
      skills:         Array.isArray(p?.skills)     ? p.skills     : [],
      education:      Array.isArray(p?.education)  ? p.education  : [],
      experience:     Array.isArray(p?.experience) ? p.experience : [],
      currentProject: p?.currentProject ?? "",
      linkedin:       p?.linkedin       ?? "",
      github:         p?.github         ?? "",
      portfolio:      p?.portfolio      ?? "",
      jobType:        p?.jobType        ?? "",
      desiredSalary:  p?.desiredSalary  ?? "",
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/cv/[userId]]", e);
    return NextResponse.json({ message: "Failed to load CV." }, { status: 500 });
  }
}
