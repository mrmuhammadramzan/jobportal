/**
 * PATCH  /api/seeker/alerts/[id] — toggle active field
 * DELETE /api/seeker/alerts/[id] — delete alert
 *
 * Next.js 16: params is a Promise — must be awaited.
 * Backend SOP Hard Rule 1: user can only modify their own alerts.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const auth   = requireAuth(req);
    const { id } = await params;
    const body   = await req.json();

    /* Only update fields that were sent */
    const data: Record<string, unknown> = {};
    if (body.active    !== undefined) data.active    = Boolean(body.active);
    if (body.keywords  !== undefined) data.keywords  = String(body.keywords).trim();
    if (body.location  !== undefined) data.location  = String(body.location);
    if (body.type      !== undefined) data.type      = String(body.type);
    if (body.frequency !== undefined) data.frequency = String(body.frequency);

    /* updateMany with userId check — ensures user owns this alert */
    const result = await db.alert.updateMany({
      where: { id, userId: auth.id },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Alert not found." }, { status: 404 });
    }

    const updated = await db.alert.findUnique({ where: { id } });
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[PATCH /api/seeker/alerts/[id]]", e);
    return NextResponse.json({ message: "Failed to update alert." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const auth   = requireAuth(req);
    const { id } = await params;

    await db.alert.deleteMany({ where: { id, userId: auth.id } });
    return NextResponse.json({ message: "Alert deleted." });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[DELETE /api/seeker/alerts/[id]]", e);
    return NextResponse.json({ message: "Failed to delete alert." }, { status: 500 });
  }
}
