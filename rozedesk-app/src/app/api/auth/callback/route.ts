/**
 * GET /api/auth/callback
 * Handles the OAuth redirect from Supabase after Google login.
 *
 * Flow:
 *   1. Exchange the `code` param for a Supabase session
 *   2. Get user's email + name from Supabase
 *   3. Find or create the user in our Prisma DB
 *   4. Issue our own JWT (same format as email/password signin)
 *   5. Set HttpOnly cookies + redirect to dashboard
 *
 * Backend SOP Hard Rule 1: we look up/create the user server-side from
 *   Supabase's verified identity — we never trust client-passed identity claims.
 * DRY: JWT creation uses same secret and expiry logic as /api/auth/signin.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { getInitials }  from "@/lib/auth";
import { getJwtSecret } from "@/lib/apiAuth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.redirect(`${APP_URL}/signin?error=missing_code`);
    }

    /* 1. Exchange code for Supabase session */
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      console.error("[/api/auth/callback] Supabase not configured.");
      return NextResponse.redirect(`${APP_URL}/signin?error=oauth_unavailable`);
    }
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.user) {
      console.error("[/api/auth/callback] Session exchange failed:", sessionError);
      return NextResponse.redirect(`${APP_URL}/signin?error=oauth_failed`);
    }

    const supaUser  = sessionData.user;
    const email     = supaUser.email?.toLowerCase();
    const name      = supaUser.user_metadata?.full_name
                   ?? supaUser.user_metadata?.name
                   ?? email?.split("@")[0]
                   ?? "User";

    if (!email) {
      return NextResponse.redirect(`${APP_URL}/signin?error=no_email`);
    }

    /* 2. Find or create user in Prisma DB */
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      /* New OAuth user — create with random unusable password hash */
      user = await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email,
            /* OAuth users have no password — store a value that bcrypt can never match */
            passwordHash: `oauth:google:${supaUser.id}`,
            role: "SEEKER",
          },
        });
        await tx.seekerProfile.create({ data: { userId: newUser.id } });
        return newUser;
      });
    }

    /* 3. Issue our JWT — 30d for OAuth users (they re-consent via Google) */
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: "30d" }
    );

    /* 4. Redirect to dashboard with cookies set */
    const redirectUrl = user.role === "ADMIN" ? `${APP_URL}/admin` : `${APP_URL}/dashboard`;
    const response    = NextResponse.redirect(redirectUrl);

    /* HttpOnly cookies for proxy.ts route guards */
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    response.cookies.set("rozedesk-token", token, { httpOnly: true, path: "/", maxAge });
    response.cookies.set("rozedesk-role",  user.role.toLowerCase(), { httpOnly: true, path: "/", maxAge });

    /* Non-HttpOnly cookie so client JS (AuthContext) can read user data */
    const userPayload = JSON.stringify({
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      initials: getInitials(user.name),
    });
    response.cookies.set("rozedesk-user-data", encodeURIComponent(userPayload), {
      httpOnly: false,
      path:     "/",
      maxAge,
    });

    return response;

  } catch (e) {
    console.error("[GET /api/auth/callback]", e);
    return NextResponse.redirect(`${APP_URL}/signin?error=server_error`);
  }
}
