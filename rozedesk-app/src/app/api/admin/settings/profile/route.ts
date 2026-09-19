/**
 * PUT /api/admin/settings/profile
 * Updates the signed-in admin's name and email.
 *
 * Backend SOP Hard Rule 1: auth + ownership verified server-side.
 * Security: email uniqueness checked before update.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    const { name, email } = await req.json() as { name?: string; email?: string };

    if (!name?.trim())  return NextResponse.json({ message: "Name is required."  }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ message: "Email is required." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    /* Check email not taken by another user */
    const conflict = await db.user.findFirst({
      where: { email: email.toLowerCase(), NOT: { id: auth.id } },
    });
    if (conflict) return NextResponse.json({ message: "Email already in use." }, { status: 409 });

    const updated = await db.user.update({
      where:  { id: auth.id },
      data:   { name: name.trim(), email: email.toLowerCase() },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/admin/settings/profile]", e);
    return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
  }
}
