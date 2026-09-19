/**
 * POST /api/auth/forgot-password
 * Generates a crypto reset token, stores it on the user, sends reset email.
 *
 * Security: always returns 200 — never reveals if email exists (prevents enumeration).
 * Token expires in 1 hour.
 * Backend SOP §7: email errors are logged in full — never silently swallowed.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const SAFE_RESPONSE = { message: "If that email exists, a reset link has been sent." };

  try {
    const { email } = await req.json() as { email?: string };
    if (!email?.trim()) return NextResponse.json({ message: "Email is required." }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

    /* Always return 200 — don't reveal whether email exists */
    if (!user) return NextResponse.json(SAFE_RESPONSE);

    /* Block OAuth-only accounts — they have no password to reset */
    if (user.passwordHash.startsWith("oauth:")) {
      /* Still return safe response — don't leak account type */
      return NextResponse.json(SAFE_RESPONSE);
    }

    /* Generate cryptographically secure token */
    const resetToken  = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    /* Store token + expiry */
    await db.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: tokenExpiry },
    });

    /* Send reset email — log FULL error so we can debug SMTP issues */
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
      console.log(`[forgot-password] Reset email sent to ${user.email}`);
    } catch (emailErr) {
      console.error("[forgot-password] SMTP ERROR — full details:", emailErr);
      /* Still return 200 — user sees "check your inbox" but we know it failed */
    }

    return NextResponse.json(SAFE_RESPONSE);

  } catch (e) {
    console.error("[POST /api/auth/forgot-password]", e);
    return NextResponse.json(SAFE_RESPONSE);
  }
}
