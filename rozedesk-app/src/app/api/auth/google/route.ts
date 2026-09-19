/**
 * GET /api/auth/google
 * Initiates Google OAuth via Supabase.
 * Redirects browser to Google consent screen.
 *
 * Returns 503 if Supabase env vars are not configured (e.g. self-hosted without OAuth).
 * Backend SOP §7: redirectUrl must be absolute, validated from env.
 * DRY: all OAuth initiation goes through this single route.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const SUPABASE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.includes("placeholder");

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  /* Gracefully disable OAuth when Supabase is not configured */
  if (!SUPABASE_CONFIGURED) {
    console.warn("[GET /api/auth/google] Supabase not configured — Google OAuth disabled.");
    return NextResponse.redirect(`${appUrl}/signin?error=oauth_unavailable`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.redirect(`${appUrl}/signin?error=oauth_unavailable`);
    }
    const redirectTo = `${appUrl}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  { redirectTo, queryParams: { access_type: "offline", prompt: "consent" } },
    });

    if (error || !data.url) {
      console.error("[GET /api/auth/google]", error);
      return NextResponse.redirect(`${appUrl}/signin?error=oauth_failed`);
    }

    return NextResponse.redirect(data.url);
  } catch (e) {
    console.error("[GET /api/auth/google]", e);
    return NextResponse.redirect(`${appUrl}/signin?error=oauth_failed`);
  }
}
