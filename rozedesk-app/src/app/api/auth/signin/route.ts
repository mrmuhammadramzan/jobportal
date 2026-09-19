/**
 * POST /api/auth/signin
 * Body: { email, password, rememberMe? }
 * Returns: { token, user, expiresIn }
 *
 * rememberMe=true  → 30-day JWT + 30-day cookie
 * rememberMe=false → 24-hour JWT + session cookie (no maxAge = expires on browser close)
 *
 * Backend SOP Hard Rule 1: server validates credentials — never trusts client claims.
 * DRY: JWT_SECRET and cookie names defined once, reused in callback route.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getInitials } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json() as {
      email?:      string;
      password?:   string;
      rememberMe?: boolean;
    };

    if (!email?.trim() || !password) {
      return err(400, "Email and password are required.");
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return err(401, "Incorrect email or password.");

    /* OAuth users (passwordHash starts with "oauth:") cannot use password login */
    if (user.passwordHash.startsWith("oauth:")) {
      return err(401, "This account uses Google sign-in. Please use the Google button.");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return err(401, "Incorrect email or password.");

    /* rememberMe: true → 30d, false → 24h */
    const expiresIn = rememberMe ? "30d" : "24h";
    const maxAge    = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn }
    );

    const userPayload = {
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      initials: getInitials(user.name),
    };

    const response = NextResponse.json({ token, user: userPayload, expiresIn });

    /* HttpOnly cookie — middleware reads this */
    response.cookies.set("rozedesk-token", token, {
      httpOnly: true,
      path:     "/",
      ...(rememberMe ? { maxAge } : {}), // session cookie if not rememberMe
    });
    response.cookies.set("rozedesk-role", user.role.toLowerCase(), {
      httpOnly: true,
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
