/**
 * supabase-server.ts — Server Supabase client for OAuth callback only.
 * Used in API routes (Node.js runtime). NOT used for DB queries.
 * DRY: one factory function, never instantiate inline.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll()        { return cookieStore.getAll(); },
        setAll(list)    {
          try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch { /* called from Server Component — safe to ignore */ }
        },
      },
    }
  );
}
