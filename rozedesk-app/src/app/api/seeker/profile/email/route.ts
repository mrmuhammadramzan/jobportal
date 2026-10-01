/**
 * PUT /api/seeker/profile/email
 * Body: { newEmail, currentPassword }
 * Changes the authenticated user's email after verifying their password.
 * Backend SOP Hard Rule 1: requires password — prevents email hijack.
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db }          from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { newEmail, currentPassword } = await req.json() as {
      newEmail?: string; currentPassword?: string;
    };

    if (!newEmail?.trim() || !currentPassword)
      return NextResponse.json({ message: "New email and current password are required." }, { status: 400 });

    const emailLower = newEmail.trim().toLowerCase();
    /* Basic email format check */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower))
      return NextResponse.json({ message: "Invalid email format." }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: auth.id } });
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid)
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 });

    /* Check uniqueness */
    const existing = await db.user.findUnique({ where: { email: emailLower } });
    if (existing && existing.id !== auth.id)
      return NextResponse.json({ message: "Email already in use by another account." }, { status: 409 });

    await db.user.update({ where: { id: auth.id }, data: { email: emailLower } });

    return NextResponse.json({ message: "Email updated. Please sign in again." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/seeker/profile/email]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
