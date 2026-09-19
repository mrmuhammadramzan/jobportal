/**
 * GET    /api/seeker/alerts — list all alerts for the authenticated seeker
 * POST   /api/seeker/alerts — create a new alert
 *
 * Backend SOP Hard Rule 1: requireAuth on every method.
 * Backend SOP Hard Rule 2: full error logging.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth   = requireAuth(req);
    const alerts = await db.alert.findMany({
      where:   { userId: auth.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(alerts);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/seeker/alerts]", e);
    return NextResponse.json({ message: "Failed to load alerts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { keywords, location, type, frequency } = await req.json();

    if (!keywords?.trim()) {
      return NextResponse.json({ message: "Keywords are required." }, { status: 400 });
    }

    const alert = await db.alert.create({
      data: {
        userId:    auth.id,
        keywords:  keywords.trim(),
        location:  location  ?? "Any",
        type:      type      ?? "Any",
        frequency: frequency ?? "Daily",
        active:    true,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/seeker/alerts]", e);
    return NextResponse.json({ message: "Failed to create alert." }, { status: 500 });
  }
}
