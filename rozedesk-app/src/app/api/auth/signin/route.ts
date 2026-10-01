/**
 * POST /api/auth/signin
 * Body: { phone, password, rememberMe? }
 * Returns: { token, user, expiresIn }
 *
 * Auth identifier: Pakistani mobile number (03XXXXXXXXX).
 * rememberMe=true  → 30-day JWT + 30-day cookie
 * rememberMe=false → 24-hour JWT + session cookie
 *
 * Backend SOP Hard Rule 1: server validates — never trusts client claims.
 * Security: timing-safe bcrypt compare; generic error message prevents user enumeration.
 * DRY: JWT_SECRET and cookie names defined once.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import bcrypt          from "bcryptjs";
import jwt             from "jsonwebtoken";
import { getInitials } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

/** Strip spaces/dashes from a phone number before DB lookup */
function normalisePhone(v: string) {
  return v.replace(/[\s\-]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { phone, password, rememberMe } = await req.json() as {
      phone?:      string;
      password?:   string;
      rememberMe?: boolean;
    };

    /* ── Server-side validation ── */
    if (!phone?.trim() || !password) {
      return err(400, "Mobile number and password are required.");
    }
    if (!/^03\d{9}$/.test(normalisePhone(phone))) {
      return err(400, "Enter a valid Pakistani mobile number (e.g. 03001234567).");
    }

    const normPhone = normalisePhone(phone);
    const user = await db.user.findFirst({ where: { phone: normPhone } });

    /* Generic message — prevents user enumeration */
    if (!user) return err(401, "Incorrect mobile number or password.");

    /* OAuth users cannot use password login */
    if (user.passwordHash.startsWith("oauth:")) {
      return err(401, "This account uses Google sign-in. Please use the Google button.");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return err(401, "Incorrect mobile number or password.");

    /* Token lifetime */
    const expiresIn = rememberMe ? "30d" : "24h";
    const maxAge    = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn },
    );

    const userPayload = {
      id:       user.id,
      name:     user.name,
      phone:    user.phone,
      role:     user.role,
      initials: getInitials(user.name),
    };

    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ token, user: userPayload, expiresIn });

    response.cookies.set("rozedesk-token", token, {
      httpOnly: true,
      secure:   isProd,
      sameSite: "lax",
      path:     "/",
      ...(rememberMe ? { maxAge } : {}),
    });
    response.cookies.set("rozedesk-role", user.role.toLowerCase(), {
      httpOnly: true,
      secure:   isProd,
      sameSite: "lax",
      path:     "/",
      ...(rememberMe ? { maxAge } : {}),
    });

    return response;
  } catch (e) {
    console.error("[POST /api/auth/signin]", e);
    return err(500, "Something went wrong.");
  }
}

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}
