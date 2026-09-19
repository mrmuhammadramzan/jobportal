/**
 * GET /api/admin/file?path=cv/userId/file.pdf
 * Returns a 1-hour signed URL for a private file in Supabase Storage.
 * Admin only — used to view CVs and payment receipts.
 *
 * Backend SOP Hard Rule 1: requireAdmin — never expose private files publicly.
 * Falls back gracefully if Storage is not configured.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const path = req.nextUrl.searchParams.get("path");
    if (!path?.trim()) {
      return NextResponse.json({ message: "path is required." }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      /* Storage not configured — return stub path for dev */
      return NextResponse.json({ url: path });
    }

    const { getSignedUrl } = await import("@/lib/storage");
    const url = await getSignedUrl(path, 3600);
    return NextResponse.json({ url });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/file]", e);
    return NextResponse.json({ message: "Failed to generate file URL." }, { status: 500 });
  }
}
