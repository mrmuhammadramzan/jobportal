/**
 * GET /api/auth/me
 * Returns the current authenticated user from JWT.
 * DRY: delegates token extraction + verification to getAuthUser (apiAuth).
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { getAuthUser }  from "@/lib/apiAuth";
import { getInitials }  from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload) return NextResponse.json({ message: "Not authenticated." }, { status: 401 });

    const user = await db.user.findUnique({ where: { id: payload.id } });
    if (!user)  return NextResponse.json({ message: "User not found." },       { status: 404 });

    return NextResponse.json({
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      initials: getInitials(user.name),
    });
  } catch {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }
}
