/**
 * supabase.ts — Browser Supabase client for OAuth initiation only.
 * NOT used for DB queries — all DB goes through Prisma.
 * DRY: one export, never call createBrowserClient inline.
 */
import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
