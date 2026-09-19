/**
 * POST /api/auth/signup
 * Registers a new job seeker and sends a welcome email.
 *
 * Backend SOP Hard Rule 1: server re-validates everything.
 * Backend SOP §7: email send failure is non-fatal — user is registered regardless.
 * Security: password hashed with bcrypt (12 rounds) before storage.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getInitials } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body as {
      fullName?: string; email?: string; password?: string;
    };

    /* ── Server-side validation ── */
    if (!fullName?.trim())                                    return err(400, "Full name is required.");
    if (!email?.trim())                                       return err(400, "Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))           return err(400, "Invalid email address.");
    if (!password || password.length < 8)                     return err(400, "Password must be at least 8 characters.");

    /* ── Check duplicate ── */
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return err(409, "This email is already registered.");

    /* ── Hash password ── */
    const passwordHash = await bcrypt.hash(password, 12);

    /* ── Create user + empty profile (atomic transaction) ── */
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name:         fullName.trim(),
          email:        email.toLowerCase(),
          passwordHash,
          role:         "SEEKER",
        },
      });
      await tx.seekerProfile.create({ data: { userId: newUser.id } });
      return newUser;
    });

    /* ── Generate JWT ── */
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    /* ── Send welcome email — non-fatal (Backend SOP §7) ── */
    sendWelcomeEmail(user.email, user.name).catch(e =>
      console.error("[signup] Welcome email failed (non-fatal):", e.message)
    );

    /* ── Build response ── */
    const response = NextResponse.json({
      token,
      user: {
        id:       user.id,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        initials: getInitials(user.name),
      },
    }, { status: 201 });

    response.cookies.set("rozedesk-token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("rozedesk-role",  user.role.toLowerCase(), { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });

    return response;

  } catch (e) {
    console.error("[POST /api/auth/signup]", e);
    return err(500, "Something went wrong. Please try again.");
  }
}

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}
