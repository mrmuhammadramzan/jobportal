/**
 * POST /api/auth/signout
 * Clears all HttpOnly auth cookies server-side.
 *
 * LESSON: HttpOnly cookies cannot be deleted by client-side JavaScript.
 * The ONLY way to clear them is via a server response with Set-Cookie maxAge=0.
 * This route is the single place that does this correctly.
 */
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out." });

  /* Clear all auth cookies — maxAge=0 expires them immediately */
  const cookieOpts = { maxAge: 0, path: "/" } as const;
  response.cookies.set("rozedesk-token",     "", cookieOpts);
  response.cookies.set("rozedesk-role",      "", cookieOpts);
  response.cookies.set("rozedesk-user-data", "", cookieOpts);

  return response;
}
