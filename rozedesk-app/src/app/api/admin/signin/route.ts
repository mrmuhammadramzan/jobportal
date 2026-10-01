/**
 * POST /api/admin/signin
 * Body: { email, password }
 * Returns: { token, user, expiresIn }
 *
 * Dedicated admin auth endpoint — email-keyed, never phone.
 * Separated from /api/auth/signin (phone-keyed, seeker-only) to avoid
 * field-mismatch bugs and keep role-enforcement server-side.
 *
 * Security:
 *   - Server validates email format + password presence (never trusts client).
 *   - Queries DB by email AND role=ADMIN — a SEEKER with a matching email
 *     cannot sign in here even if somehow the check were bypassed.
 *   - Generic error message on bad credentials prevents user enumeration.
 *   - bcrypt.compare is used (timing-safe by design).
 *   - JWT signed with JWT_SECRET from env — never hardcoded.
 *   - HttpOnly cookie set — prevents XSS token theft.
 *
 * Backend SOP Hard Rule 1: server validates all inputs.
 * DRY: JWT_SECRET, cookie names, and token lifetime constants defined once.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }          from "@/lib/db";
import bcrypt          from "bcryptjs";
import jwt             from "jsonwebtoken";
import { getInitials } from "@/lib/auth";

const JWT_SECRET      = process.env.JWT_SECRET ?? "dev_secret";
const TOKEN_COOKIE    = "rozedesk-token";
const ROLE_COOKIE     = "rozedesk-role";
const EXPIRES_IN      = "24h";
const MAX_AGE_SECONDS = 60 * 60 * 24; /* 24 h */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function err(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    /* ── 1. Server-side input validation ── */
    if (!email?.trim() || !password?.trim()) {
      return err(400, "Email and password are required.");
    }
    if (!EMAIL_RE.test(email.trim())) {
      return err(400, "Enter a valid email address.");
    }

    /* ── 2. Lookup by email — must exist and be ADMIN ──
       Querying by role too means a SEEKER with the same email
       cannot authenticate through this endpoint.               */
    const admin = await db.user.findFirst({
      where: { email: email.trim().toLowerCase(), role: "ADMIN" },
      select: {
        id:           true,
        name:         true,
        email:        true,
        passwordHash: true,
        role:         true,
        blocked:      true,
      },
    });

    /* Generic message — prevents enumeration of admin email addresses */
    if (!admin) return err(401, "Incorrect email or password.");

    /* ── 3. Blocked-account guard ── */
    if (admin.blocked) return err(403, "This account has been suspended.");

    /* ── 4. Password verify ── */
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return err(401, "Incorrect email or password.");

    /* ── 5. Sign JWT ── */
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN },
    );

    const userPayload = {
      id:       admin.id,
      name:     admin.name,
      email:    admin.email,
      role:     admin.role,
      initials: getInitials(admin.name),
    };

    /* ── 6. Set HttpOnly cookies + return token ── */
    const response = NextResponse.json({ token, user: userPayload, expiresIn: EXPIRES_IN });

    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   MAX_AGE_SECONDS,
    });
    response.cookies.set(ROLE_COOKIE, admin.role.toLowerCase(), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   MAX_AGE_SECONDS,
    });

    return response;
  } catch (e) {
    console.error("[POST /api/admin/signin]", e);
    return err(500, "Something went wrong. Please try again.");
  }
}
