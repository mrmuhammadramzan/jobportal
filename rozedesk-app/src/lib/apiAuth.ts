/**
 * apiAuth.ts — Server-side auth helper for API routes.
 * DRY: one function to extract + verify the JWT from any API request.
 * Import in every protected API route.
 */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

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

/** requireAuth — returns user or throws a 401 Response */
export function requireAuth(req: NextRequest): JwtPayload {
  const user = getAuthUser(req);
  if (!user) throw new Response(JSON.stringify({ message: "Not authenticated." }), { status: 401 });
  return user;
}

/** requireAdmin — returns user or throws 401/403 */
export function requireAdmin(req: NextRequest): JwtPayload {
  const user = requireAuth(req);
  if (user.role !== "ADMIN") throw new Response(JSON.stringify({ message: "Forbidden." }), { status: 403 });
  return user;
}
