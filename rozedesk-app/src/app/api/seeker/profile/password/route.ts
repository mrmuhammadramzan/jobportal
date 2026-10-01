/**
 * PUT /api/seeker/profile/password
 * Body: { currentPassword, newPassword }
 * Changes the authenticated user's password.
 * Backend SOP Hard Rule 1: requires current password — no privilege escalation.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db }          from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { currentPassword, newPassword } = await req.json() as {
      currentPassword?: string; newPassword?: string;
    };

    if (!currentPassword || !newPassword)
      return NextResponse.json({ message: "Both passwords are required." }, { status: 400 });
    if (newPassword.length < 8)
      return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: auth.id } });
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid)
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: auth.id }, data: { passwordHash: hash } });

    return NextResponse.json({ message: "Password updated." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/seeker/profile/password]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
