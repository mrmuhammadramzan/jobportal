/**
 * GET /api/auth/google
 * Initiates Google OAuth via Supabase.
 * Redirects browser to Google consent screen.
 *
 * Backend SOP §7: redirectUrl must be absolute, validated from env.
 * DRY: all OAuth initiation goes through this single route.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const supabase   = await createSupabaseServerClient();
    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const redirectTo = `${appUrl}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt:      "consent",
        },
      },
    });

    if (error || !data.url) {
      console.error("[GET /api/auth/google]", error);
      return NextResponse.redirect(`${appUrl}/signin?error=oauth_failed`);
    }

    return NextResponse.redirect(data.url);
  } catch (e) {
    console.error("[GET /api/auth/google]", e);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/signin?error=oauth_failed`);
  }
}
