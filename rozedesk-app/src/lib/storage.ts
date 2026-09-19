/**
 * storage.ts — Supabase Storage upload helpers.
 *
 * Uses @supabase/supabase-js directly (no auth needed for public buckets).
 * All uploads go to the "rozedesk" bucket:
 *   cv/      — seeker CVs (private — only accessible via signed URL)
 *   receipts/ — payment receipts (private)
 *
 * DRY: all file upload logic defined here, never inline.
 * Backend SOP §7: throws on upload failure — caller handles the error.
 *
 * SETUP (one-time in Supabase):
 *   1. Go to Supabase Dashboard → Storage → New bucket
 *   2. Name: "rozedesk" — keep it Private (not public)
 *   3. No extra config needed — service key handles auth
 */
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key     = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for file uploads."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

const BUCKET = "rozedesk";

/**
 * Upload a file to Supabase Storage.
 * Returns the storage path (not a public URL — use getSignedUrl() to view).
 */
export async function uploadFile(
  file: File,
  folder: "cv" | "receipts",
  userId: string,
  jobId: string
): Promise<string> {
  const supabase  = getSupabaseAdmin();
  const ext       = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path      = `${folder}/${userId}/${jobId}_${Date.now()}.${ext}`;
  const arrayBuf  = await file.arrayBuffer();
  const buffer    = Buffer.from(arrayBuf);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert:      false,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return path; // e.g. "cv/user123/jobAbc_1726400000000.pdf"
}

/**
 * Generate a signed URL for a private file (expires in 1 hour by default).
 * Used when admin needs to view a receipt or CV.
 */
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${error?.message ?? "unknown"}`);
  }
  return data.signedUrl;
}
