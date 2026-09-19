/**
 * GET  /api/admin/admins — list all admin accounts (root admin only)
 * POST /api/admin/admins — create a new admin account (root admin only)
 *
 * Root admin = the first admin in the DB (oldest createdAt).
 * Only the root admin can create or delete other admin accounts.
 * The root admin account itself can never be deleted.
 *
 * Backend SOP Hard Rule 1: role and root status verified server-side every request.
 * Backend SOP §5.2: never trust role from request body — always look up from DB.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import bcrypt from "bcryptjs";

/* ── Helper: get root admin (first admin by createdAt) ── */
async function getRootAdminId(): Promise<string | null> {
  const root = await db.user.findFirst({
    where:   { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select:  { id: true },
  });
  return root?.id ?? null;
}

/** Check if the given user ID is the root admin */
async function isRoot(userId: string): Promise<boolean> {
  const rootId = await getRootAdminId();
  return userId === rootId;
}

export async function GET(req: NextRequest) {
  try {
    const caller  = requireAdmin(req);
    const rootId  = await getRootAdminId();
    const isRootCaller = caller.id === rootId;

    /* Non-root admins get an empty list — the UI hides the section for them */
    if (!isRootCaller) {
      return NextResponse.json([], { status: 200 });
    }

    const admins = await db.user.findMany({
      where:   { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
      select:  { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(admins.map(a => ({
      ...a,
      isRoot: a.id === rootId,
    })));
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/admins]", e);
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const caller = requireAdmin(req);
    if (!await isRoot(caller.id)) {
      return NextResponse.json({ message: "Only the root admin can create admin accounts." }, { status: 403 });
    }

    const { name, email, password } = await req.json() as {
      name?: string; email?: string; password?: string;
    };

    if (!name?.trim())  return NextResponse.json({ message: "Name is required."  }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ message: "Email is required." }, { status: 400 });
    if (!password || password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ message: "Email already registered." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await db.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), passwordHash, role: "ADMIN" },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ ...admin, isRoot: false }, { status: 201 });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/admin/admins]", e);
    return NextResponse.json({ message: "Failed to create admin." }, { status: 500 });
  }
}
