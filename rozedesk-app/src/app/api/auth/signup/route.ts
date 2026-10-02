/**
 * POST /api/auth/signup
 * Registers a new user (job seeker).
 * Body: { fullName, phone, password }
 *   phone — Pakistani mobile: 03XXXXXXXXX (11 digits, starts with 03)
 *
 * Auth identifier: phone number only — no email required or stored at registration.
 * Backend SOP Hard Rule 1: server re-validates all inputs.
 * Security: bcrypt 12 rounds; phone is the unique key for duplicate check.
 * DRY: JWT_SECRET defined once; err() helper reused.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import bcrypt          from "bcryptjs";
import jwt             from "jsonwebtoken";
import { getInitials }  from "@/lib/auth";
import { getJwtSecret } from "@/lib/apiAuth";

function isValidPKPhone(v: string): boolean {
  return /^03\d{9}$/.test(v.replace(/[\s\-]/g, ""));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, password } = body as {
      fullName?: string;
      phone?:    string;
      password?: string;
    };

    /* ── Server-side validation ── */
    if (!fullName?.trim())
      return err(400, "Full name is required.");
    if (!phone?.trim())
      return err(400, "Mobile number is required.");
    if (!isValidPKPhone(phone))
      return err(400, "Enter a valid Pakistani mobile number (e.g. 03001234567).");
    if (!password || password.length < 8)
      return err(400, "Password must be at least 8 characters.");

    const normPhone = phone.replace(/[\s\-]/g, "");

    /* ── Duplicate check — phone is the sole unique identifier ── */
    const existing = await db.user.findFirst({
      where:  { phone: normPhone },
      select: { id: true },
    });
    if (existing) return err(409, "This mobile number is already registered.");

    /* ── Hash password ── */
    const passwordHash = await bcrypt.hash(password, 12);

    /* ── Create user + empty seeker profile (atomic) ── */
    /* NOTE: Prisma schema requires email @unique — we derive a stable placeholder
       from the phone number so the unique constraint is satisfied without exposing
       email in the UI. A schema migration to make email nullable is the long-term fix. */
    const placeholderEmail = `${normPhone}@phone.rozedesk.local`;

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name:         fullName.trim(),
          email:        placeholderEmail,
          phone:        normPhone,
          passwordHash,
          role:         "SEEKER",
        },
      });
      await tx.seekerProfile.create({
        data: { userId: newUser.id, phone: normPhone },
      });
      return newUser;
    });

    /* ── JWT — phone as identity claim ── */
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      getJwtSecret(),
      { expiresIn: "30d" },
    );

    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      token,
      user: {
        id:       user.id,
        name:     user.name,
        phone:    user.phone,
        role:     user.role,
        initials: getInitials(user.name),
      },
    }, { status: 201 });

    response.cookies.set("rozedesk-token", token, {
      httpOnly: true, secure: isProd, sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("rozedesk-role", user.role.toLowerCase(), {
      httpOnly: true, secure: isProd, sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (e) {
    console.error("[POST /api/auth/signup]", e);
    return err(500, "Something went wrong. Please try again.");
  }
}

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}
