/**
 * GET /api/auth/me
 * Returns the current authenticated user from JWT.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { getInitials } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("rozedesk-token")?.value
      ?? req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return NextResponse.json({ message: "Not authenticated." }, { status: 401 });

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user    = await db.user.findUnique({ where: { id: payload.id } });
    if (!user)    return NextResponse.json({ message: "User not found." }, { status: 404 });

    return NextResponse.json({
      id: user.id, name: user.name, email: user.email,
      role: user.role, initials: getInitials(user.name),
    });
  } catch {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }
}
