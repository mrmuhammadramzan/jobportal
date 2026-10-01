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

    /* Path traversal guard — only allow files under cv/ or receipts/ prefixes.
       Prevents a forged request like path=../../other-bucket/secret generating
       a signed URL for arbitrary storage objects.                              */
    const ALLOWED_PREFIXES = ["cv/", "receipts/", "screenshots/"];
    const normalised = path.replace(/\\/g, "/").replace(/\/\.\.\/|^\.\.\/|\.\.$/, "");
    if (!ALLOWED_PREFIXES.some(p => normalised.startsWith(p))) {
      return NextResponse.json(
        { message: "Invalid file path. Only cv/, receipts/, or screenshots/ paths are allowed." },
        { status: 400 },
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ url: normalised });
    }

    const { getSignedUrl } = await import("@/lib/storage");
    const url = await getSignedUrl(normalised, 3600);
    return NextResponse.json({ url });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/file]", e);
    return NextResponse.json({ message: "Failed to generate file URL." }, { status: 500 });
  }
}
