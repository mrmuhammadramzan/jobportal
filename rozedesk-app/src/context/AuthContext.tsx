"use client";
/**
 * AuthContext — Provides current user session to all client components.
 *
 * DRY: one context, consumed everywhere via useAuth().
 * Never read auth state from localStorage directly in a component.
 *
 * Backend readiness:
 *   Currently reads from localStorage (set by signin/signup pages).
 *   When a real auth system (NextAuth, Clerk, custom JWT) is added:
 *   1. Replace getStoredUser() with the real session fetch.
 *   2. The useAuth() hook API stays the same — components don't change.
 *
 * Usage:
 *   const { user, isLoading, signOut } = useAuth();
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { type AuthUser } from "@/lib/api";
import { getStoredUser, signOut as authSignOut, getInitials } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

/* ── Context shape ── */
interface AuthContextValue {
  user:       AuthUser | null;
  isLoading:  boolean;
  signOut:    () => void;
  /** Call after a successful login to refresh the context */
  refreshUser:() => void;
}

const AuthContext = createContext<AuthContextValue>({
  user:        null,
  isLoading:   true,
  signOut:     () => {},
  refreshUser: () => {},
});

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router                    = useRouter();
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Load user from storage on mount — also picks up rozedesk-user-data cookie from OAuth callback */
  const refreshUser = useCallback(() => {
    /* 1. Try localStorage (email/password login) */
    let stored = getStoredUser();

    /* 2. Fall back to the cookie set by the OAuth callback */
    if (!stored && typeof document !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find(row => row.startsWith("rozedesk-user-data="));
      if (match) {
        try {
          const raw  = decodeURIComponent(match.split("=")[1]);
          const data = JSON.parse(raw) as AuthUser;
          /* Sync into localStorage so getStoredUser works going forward */
          localStorage.setItem("rozedesk-user",  JSON.stringify(data));
          localStorage.setItem("rozedesk-token",
            document.cookie.split("; ")
              .find(r => r.startsWith("rd_token="))
              ?.split("=")[1] ?? ""
          );
          stored = data;
        } catch { /* malformed cookie — ignore */ }
      }
    }

    setUser(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleSignOut = useCallback(async () => {
    /* Server clears HttpOnly cookies — the only reliable way */
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" }).catch(() => {});
    authSignOut();
    document.cookie = "rozedesk-user-data=; Max-Age=0; path=/";
    setUser(null);
    router.push(ROUTES.signIn);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signOut:     handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Consumer hook ── */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/* ── Convenience helpers ── */
export function useUser(): AuthUser | null {
  return useAuth().user;
}

export function useUserInitials(fallback = "U"): string {
  const user = useUser();
  if (!user) return fallback;
  return user.initials || getInitials(user.name) || fallback;
}
