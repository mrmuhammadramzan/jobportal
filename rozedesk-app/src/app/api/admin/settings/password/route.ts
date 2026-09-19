/**
 * PUT /api/admin/settings/password
 * Changes the admin's password after verifying the current one.
 *
 * Backend SOP Hard Rule 1: current password verified before allowing change.
 * Security: bcrypt compare on current, bcrypt hash on new.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    const { currentPassword, newPassword, confirmPassword } = await req.json() as {
      currentPassword?: string;
      newPassword?:     string;
      confirmPassword?: string;
    };

    if (!currentPassword) return NextResponse.json({ message: "Current password is required." }, { status: 400 });
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "New passwords do not match." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: auth.id } });
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });

    /* Verify current password */
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 });

    /* Hash and store new password */
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: auth.id }, data: { passwordHash } });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PUT /api/admin/settings/password]", e);
    return NextResponse.json({ message: "Failed to update password." }, { status: 500 });
  }
}
