/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 * Validates reset token and updates password.
 *
 * Backend SOP Hard Rule 1: token validated server-side, never trusted from body alone.
 * Security: expired or invalid tokens return same message to prevent timing attacks.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json() as { token?: string; password?: string };

    if (!token?.trim())                return err(400, "Reset token is required.");
    if (!password || password.length < 8) return err(400, "Password must be at least 8 characters.");

    /* Find user by token and check expiry */
    const user = await db.user.findFirst({
      where: {
        resetToken:       token,
        resetTokenExpiry: { gt: new Date() }, // not expired
      },
    });

    if (!user) return err(400, "This reset link is invalid or has expired. Please request a new one.");

    /* Hash new password and clear token */
    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken:       null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password updated successfully. You can now sign in." });

  } catch (e) {
    console.error("[POST /api/auth/reset-password]", e);
    return err(500, "Something went wrong. Please try again.");
  }
}

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}
