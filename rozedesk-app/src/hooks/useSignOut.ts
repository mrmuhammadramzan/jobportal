/**
 * useSignOut — single source of truth for signing out.
 *
 * DRY: called from DashboardHeader, Sidebar, and any future component.
 * Never duplicate sign-out logic inline.
 *
 * What it does:
 *   1. Calls /api/auth/signout (server clears HttpOnly cookies — the ONLY reliable way)
 *   2. Clears localStorage (token + user)
 *   3. Clears any non-HttpOnly cookies client-side
 *   4. Redirects to /signin
 *
 * LESSON: HttpOnly cookies CANNOT be cleared by JavaScript (document.cookie).
 * They must be cleared server-side via a Set-Cookie response header with maxAge=0.
 */
import { useCallback } from "react";
import { useRouter }   from "next/navigation";
import { signOut as clearLocalStorage } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export function useSignOut() {
  const router = useRouter();

  return useCallback(async () => {
    /* 1. Server clears HttpOnly cookies (rozedesk-token, rozedesk-role) */
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" }).catch(() => {});

    /* 2. Clear localStorage */
    clearLocalStorage();

    /* 3. Clear non-HttpOnly cookies client-side */
    document.cookie = "rozedesk-user-data=; Max-Age=0; path=/";

    /* 4. Navigate to signin */
    router.push(ROUTES.signIn);
  }, [router]);
}
