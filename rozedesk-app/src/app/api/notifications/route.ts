/**
 * GET    /api/notifications          — get user's notifications (unread first)
 * PATCH  /api/notifications          — mark all as read
 * DELETE /api/notifications          — clear all notifications
 *
 * Backend SOP Hard Rule 1: requireAuth on every method.
 * DRY: single route handles all notification operations.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth  = requireAuth(req);
    const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? "20"));

    const notifications = await db.notification.findMany({
      where:   { userId: auth.id },
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
      take:    limit,
    });

    const unreadCount = await db.notification.count({
      where: { userId: auth.id, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/notifications]", e);
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    await db.notification.updateMany({
      where: { userId: auth.id, read: false },
      data:  { read: true },
    });
    return NextResponse.json({ message: "Marked all as read." });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    await db.notification.deleteMany({ where: { userId: auth.id } });
    return NextResponse.json({ message: "Cleared." });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ message: "Failed." }, { status: 500 });
  }
}
