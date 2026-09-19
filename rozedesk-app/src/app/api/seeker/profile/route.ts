/**
 * GET    /api/seeker/profile  — return full profile with all fields
 * PUT    /api/seeker/profile  — update any profile fields
 * DELETE /api/seeker/profile  — delete account + all data
 *
 * Backend SOP Hard Rule 1: requireAuth on every method.
 * DRY: single route handles all profile operations.
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

    return NextResponse.json({
      id:             user.id,
      name:           user.name,
      email:          user.email,
      phone:          user.profile?.phone          ?? "",
      location:       user.profile?.location       ?? "",
      summary:        user.profile?.summary        ?? "",
      /* Safely coerce array fields — guard against corrupted DB data */
      skills:         Array.isArray(user.profile?.skills)    ? user.profile.skills    : [],
      linkedin:       user.profile?.linkedin       ?? "",
      github:         user.profile?.github         ?? "",
      portfolio:      user.profile?.portfolio      ?? "",
      education:      Array.isArray(user.profile?.education)  ? user.profile.education  : [],
      experience:     Array.isArray(user.profile?.experience) ? user.profile.experience : [],
      currentProject: user.profile?.currentProject ?? "",
      jobType:        user.profile?.jobType        ?? "",
      desiredSalary:  user.profile?.desiredSalary  ?? "",
      remotePref:     user.profile?.remotePref     ?? "",
      cvUrl:          user.profile?.cvUrl          ?? "",
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/seeker/profile]", e);
    return NextResponse.json({ message: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const body = await req.json();

    /* Update user name if provided */
    if (body.name?.trim()) {
      await db.user.update({ where: { id: auth.id }, data: { name: body.name.trim() } });
    }
    if (body.email?.trim()) {
      const conflict = await db.user.findFirst({
        where: { email: body.email.toLowerCase(), NOT: { id: auth.id } },
      });
      if (conflict) return NextResponse.json({ message: "Email already in use." }, { status: 409 });
      await db.user.update({ where: { id: auth.id }, data: { email: body.email.toLowerCase() } });
    }

    /* Upsert profile */
    const profile = await db.seekerProfile.upsert({
      where:  { userId: auth.id },
      create: { userId: auth.id, ...buildProfileData(body) },
      update: buildProfileData(body),
    });

    return NextResponse.json(profile);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/seeker/profile]", e);
    return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    await db.user.delete({ where: { id: auth.id } });
    const response = NextResponse.json({ message: "Account deleted." });
    response.cookies.set("rozedesk-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("rozedesk-role",  "", { maxAge: 0, path: "/" });
    return response;
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[DELETE /api/seeker/profile]", e);
    return NextResponse.json({ message: "Failed to delete account." }, { status: 500 });
  }
}

/** Build profile data object — only include fields that were sent */
function buildProfileData(body: Record<string, unknown>) {
  const d: Record<string, unknown> = {};
  if (body.phone          !== undefined) d.phone          = body.phone          || null;
  if (body.location       !== undefined) d.location       = body.location       || null;
  if (body.summary        !== undefined) d.summary        = body.summary        || null;
  if (body.skills         !== undefined) d.skills         = Array.isArray(body.skills) ? body.skills : [];
  if (body.linkedin       !== undefined) d.linkedin       = body.linkedin       || null;
  if (body.github         !== undefined) d.github         = body.github         || null;
  if (body.portfolio      !== undefined) d.portfolio      = body.portfolio      || null;
  if (body.education  !== undefined) d.education  = Array.isArray(body.education)  ? body.education  : [];
  if (body.experience !== undefined) d.experience = Array.isArray(body.experience) ? body.experience : [];
  if (body.currentProject !== undefined) d.currentProject = body.currentProject || null;
  if (body.jobType        !== undefined) d.jobType        = body.jobType        || null;
  if (body.desiredSalary  !== undefined) d.desiredSalary  = body.desiredSalary  || null;
  if (body.remotePref     !== undefined) d.remotePref     = body.remotePref     || null;
  return d;
}
