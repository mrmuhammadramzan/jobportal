/**
 * DELETE /api/admin/jobs/all
 * Permanently deletes ALL job listings + their applications and payments.
 * Root admin only — irreversible.
 *
 * UI/UX SOP §Hard Rule 5: two-step confirmation handled on the client.
 * Backend SOP Hard Rule 1: root admin identity verified server-side.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

async function getRootAdminId(): Promise<string | null> {
  const root = await db.user.findFirst({
    where: { role: "ADMIN" }, orderBy: { createdAt: "asc" }, select: { id: true },
  });
  return root?.id ?? null;
}

export async function DELETE(req: NextRequest) {
  try {
    const admin  = requireAdmin(req);
    const rootId = await getRootAdminId();

    /* Only root admin can nuke all jobs */
    if (admin.id !== rootId) {
      return NextResponse.json({ message: "Only the root admin can delete all listings." }, { status: 403 });
    }

    /* Cascade deletes: payments → applications → jobs (FK cascade handles it) */
    const { count } = await db.job.deleteMany();

    return NextResponse.json({ message: `Deleted ${count} job listing${count !== 1 ? "s" : ""}.`, count });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[DELETE /api/admin/jobs/all]", e);
    return NextResponse.json({ message: "Failed to delete listings." }, { status: 500 });
  }
}
