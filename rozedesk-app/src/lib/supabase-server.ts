/**
 * supabase-server.ts — Server Supabase client for OAuth callback only.
 * Used in API routes (Node.js runtime). NOT used for DB queries.
 * DRY: one factory function, never instantiate inline.
 *
 * Returns null if Supabase env vars are not configured.
 * Callers must check for null before using the client.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  if (!url || url.includes("placeholder") || !key || key.includes("placeholder")) {
    return null;
  }

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll()     { return cookieStore.getAll(); },
      setAll(list) {
        try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Component context — safe to ignore */ }
      },
    },
  });
}
