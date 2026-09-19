/**
 * GET /api/setup/admin?secret=SETUP_SECRET
 *
 * One-time bootstrap endpoint — creates the root admin account.
 *
 * SECURITY:
 *   1. Protected by SETUP_SECRET env var — returns 403 without it.
 *   2. Admin password comes from ADMIN_INITIAL_PASSWORD env var.
 *      Falls back to a random password printed once in the response.
 *      NO hardcoded passwords — DevOps SOP Hard Rule 1.
 *   3. After first login, remove SETUP_SECRET from env (or rotate it)
 *      to disable this endpoint permanently.
 *
 * Usage:
 *   GET /api/setup/admin?secret=YOUR_SETUP_SECRET
 *
 * Env vars:
 *   SETUP_SECRET             — required, protects this endpoint
 *   ADMIN_EMAIL              — optional, default admin@rozedesk.com
 *   ADMIN_INITIAL_PASSWORD   — optional, random 16-char if not set
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  /* ── 1. Secret guard ── */
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    /* SETUP_SECRET not configured — endpoint is permanently disabled */
    return NextResponse.json({ message: "Setup endpoint is disabled." }, { status: 403 });
  }

  const provided = req.nextUrl.searchParams.get("secret");
  if (!provided || provided !== setupSecret) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  /* ── 2. Resolve admin credentials from env — never hardcoded ── */
  const email    = process.env.ADMIN_EMAIL ?? "admin@rozedesk.com";
  const password = process.env.ADMIN_INITIAL_PASSWORD
    /* Random 16-char alphanumeric if env not set — shown once in response */
    ?? crypto.randomBytes(12).toString("base64url").slice(0, 16);

  const hash = await bcrypt.hash(password, 12);

  /* ── 3. Upsert admin ── */
  await db.user.upsert({
    where:  { email },
    update: { passwordHash: hash, role: "ADMIN", name: "Super Admin" },
    create: {
      name:         "Super Admin",
      email,
      passwordHash: hash,
      role:         "ADMIN",
    },
  });

  /* ── 4. Response — only show password if it was auto-generated ── */
  const usingEnvPassword = Boolean(process.env.ADMIN_INITIAL_PASSWORD);

  return NextResponse.json({
    message: "Root admin ready.",
    email,
    ...(usingEnvPassword
      ? { password: "(set via ADMIN_INITIAL_PASSWORD env var)" }
      : { password, warning: "Save this password now — it will not be shown again." }
    ),
    next: "Remove SETUP_SECRET from env after first login to disable this endpoint.",
  });
}
