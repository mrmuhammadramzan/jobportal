/**
 * DELETE /api/admin/admins/[id] — delete an admin account
 *
 * Rules:
 *   - Only root admin can delete other admins
 *   - Root admin account can NEVER be deleted
 *   - Admin cannot delete themselves
 *
 * Next.js 16: params is a Promise — must be awaited.
 * Backend SOP Hard Rule 1: all rules enforced server-side.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

async function getRootAdminId(): Promise<string | null> {
  const root = await db.user.findFirst({
    where:   { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select:  { id: true },
  });
  return root?.id ?? null;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const caller = requireAdmin(req);
    const { id } = await params;
    const rootId = await getRootAdminId();

    /* Rule 1: only root admin can delete other admins */
    if (caller.id !== rootId) {
      return NextResponse.json({ message: "Only the root admin can delete admin accounts." }, { status: 403 });
    }

    /* Rule 2: root admin cannot be deleted */
    if (id === rootId) {
      return NextResponse.json({ message: "The root admin account cannot be deleted." }, { status: 403 });
    }

    /* Rule 3: cannot delete self (redundant with rule 2 for root, but safe) */
    if (id === caller.id) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 403 });
    }

    /* Verify the target is actually an admin */
    const target = await db.user.findUnique({ where: { id }, select: { role: true } });
    if (!target || target.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin not found." }, { status: 404 });
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ message: "Admin account deleted." });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[DELETE /api/admin/admins/[id]]", e);
    return NextResponse.json({ message: "Failed to delete admin." }, { status: 500 });
  }
}
