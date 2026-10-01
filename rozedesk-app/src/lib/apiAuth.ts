/**
 * apiAuth.ts — Server-side auth helper for API routes.
 * DRY: one function to extract + verify the JWT from any API request.
 * Import in every protected API route.
 */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/* In production, JWT_SECRET MUST be set — a known fallback lets anyone forge tokens.
   If the env var is absent in production we throw at startup, not at runtime. */
const JWT_SECRET = (() => {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET env var is not set. Set it before deploying.");
  }
  return s ?? "dev_secret_local_only";
})();

export interface JwtPayload {
  id:    string;
  email: string;
  role:  string;
}

/**
 * getAuthUser — extract JWT from cookie or Authorization header.
 * Returns the decoded payload, or null if missing/invalid.
 */
export function getAuthUser(req: NextRequest): JwtPayload | null {
  try {
    const token =
      req.cookies.get("rozedesk-token")?.value ??
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/* ── Shared header so every thrown Response is always parseable as JSON ── */
const JSON_HEADERS = { "Content-Type": "application/json" };

/** requireAuth — returns user or throws a 401 Response */
export function requireAuth(req: NextRequest): JwtPayload {
  const user = getAuthUser(req);
  if (!user) throw new Response(
    JSON.stringify({ message: "Not authenticated." }),
    { status: 401, headers: JSON_HEADERS },
  );
  return user;
}

/** requireAdmin — returns user or throws 401/403 */
export function requireAdmin(req: NextRequest): JwtPayload {
  const user = requireAuth(req);
  if (user.role !== "ADMIN") throw new Response(
    JSON.stringify({ message: "Forbidden." }),
    { status: 403, headers: JSON_HEADERS },
  );
  return user;
}
