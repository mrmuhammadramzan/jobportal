/**
 * middleware.ts — Next.js route guards for RozeDesk.
 *
 * Runs on EVERY matching request BEFORE the page renders.
 * This is the correct place for auth checks — not inside components.
 *
 * Rules:
 *   /dashboard/* → must have rozedesk-token cookie → else redirect to /signin
 *   /admin/*     → must have rozedesk-token + rozedesk-role=admin cookie → else /admin/login
 *   /signin      → if already logged in as seeker, redirect to /dashboard
 *   /signup      → if already logged in, redirect to /dashboard
 *   /admin/login → if already logged in as admin, redirect to /admin
 *
 * Backend readiness:
 *   Currently reads cookies set by the client (localStorage mirror).
 *   In production, swap to HttpOnly JWT cookie or NextAuth session.
 *   The middleware structure stays the same — only the token source changes.
 *
 * NOTE: localStorage is NOT available in middleware (Edge runtime).
 * Auth state must be stored in a cookie. The signin/admin-login pages
 * must set a cookie (via document.cookie or Set-Cookie header) as well
 * as localStorage when login succeeds.
 */
import { NextRequest, NextResponse } from "next/server";

/* ── Cookie names ── */
const TOKEN_COOKIE = "rozedesk-token";
const ROLE_COOKIE  = "rozedesk-role";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role  = request.cookies.get(ROLE_COOKIE)?.value;

  const isLoggedIn   = Boolean(token);
  const isAdminUser  = role === "admin";
  const isSeekerUser = role === "seeker";

  /* ── Protect /dashboard/* ── */
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    /* Admins trying to use seeker dashboard → redirect to admin */
    if (isAdminUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  /* ── Protect /admin/* (except /admin/login) ── */
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdminUser) {
      /* Logged-in seeker trying to access admin → back to dashboard */
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  /* ── Redirect already-logged-in users away from auth pages ── */
  if ((pathname === "/signin" || pathname === "/signup") && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminUser ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login" && isLoggedIn && isAdminUser) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/* ── Apply middleware to these paths only ── */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
  ],
};
