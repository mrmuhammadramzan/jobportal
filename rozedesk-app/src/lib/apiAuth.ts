/**
 * apiAuth.ts — Server-side auth helper for API routes.
 * DRY: one function to extract + verify the JWT from any API request.
 *
 * SECURITY: JWT_SECRET is validated lazily at first request, NOT at module
 * evaluation time. This lets Next.js collect page data during `next build`
 * without crashing when env vars are not available in the build container.
 * The validation is still strict — any request in production without
 * JWT_SECRET set will immediately return 500, never fall back to a weak key.
 */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id:    string;
  email: string;
  role:  string;
}

/**
 * getJwtSecret — lazy resolver, exported so auth routes (signin/signup/callback)
 * can sign tokens with the same secret without duplicating the guard logic.
 * Called at request time — never at module evaluation, so next build never throws.
 */
export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET env var is not set.");
    }
    return "dev_secret_local_only";
  }
  return s;
}

/* ── Shared header so every thrown Response is always parseable as JSON ── */
const JSON_HEADERS = { "Content-Type": "application/json" };

/**
 * getAuthUser — extract JWT from cookie or Authorization header.
 * Returns the decoded payload, or null if missing/invalid/secret-missing.
 */
export function getAuthUser(req: NextRequest): JwtPayload | null {
  try {
    const token =
      req.cookies.get("rozedesk-token")?.value ??
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return null;
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

/** requireAuth — returns user or throws a 401/500 Response */
export function requireAuth(req: NextRequest): JwtPayload {
  // Surface misconfiguration as 500, not silent null
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Response(
      JSON.stringify({ message: "Server misconfiguration." }),
      { status: 500, headers: JSON_HEADERS },
    );
  }

  const user = getAuthUser(req);
  if (!user) throw new Response(
    JSON.stringify({ message: "Not authenticated." }),
    { status: 401, headers: JSON_HEADERS },
  );
  return user;
}

/** requireAdmin — returns user or throws 401/403/500 */
export function requireAdmin(req: NextRequest): JwtPayload {
  const user = requireAuth(req);
  if (user.role !== "ADMIN") throw new Response(
    JSON.stringify({ message: "Forbidden." }),
    { status: 403, headers: JSON_HEADERS },
  );
  return user;
}
