/**
 * GET /api/seeker/cv
 * Returns structured CV data for the authenticated seeker.
 * Used by the profile page to render a live CV preview.
 * Backend SOP Hard Rule 1: requireAuth.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const user = await db.user.findUnique({
      where:   { id: auth.id },
      include: { profile: true },
    });
    if (!user) return NextResponse.json({ message: "Not found." }, { status: 404 });

    const p = user.profile;
    return NextResponse.json({
      name:           user.name,
      email:          user.email,
      phone:          p?.phone          ?? "",
      location:       p?.location       ?? "",
      summary:        p?.summary        ?? "",
      skills:         p?.skills         ?? [],
      linkedin:       p?.linkedin       ?? "",
      github:         p?.github         ?? "",
      portfolio:      p?.portfolio      ?? "",
      education:      p?.education      ?? [],
      experience:     p?.experience     ?? [],
      currentProject: p?.currentProject ?? "",
      jobType:        p?.jobType        ?? "",
      desiredSalary:  p?.desiredSalary  ?? "",
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/seeker/cv]", e);
    return NextResponse.json({ message: "Failed to load CV data." }, { status: 500 });
  }
}
