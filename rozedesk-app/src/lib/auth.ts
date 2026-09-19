/**
 * auth.ts — Auth helpers for RozeDesk.
 *
 * DRY: one place for all auth-related logic.
 * Pages import from here — never roll their own token management.
 *
 * Backend readiness:
 *   Swap the localStorage stubs below for real session management
 *   (e.g., NextAuth.js, Clerk, or custom JWT + HttpOnly cookie).
 *   The exported function signatures stay the same — only the
 *   implementation changes.
 */
import { setToken, clearToken, type AuthUser } from "./api";

/* ── Storage key constants — DRY ── */
const USER_KEY  = "rozedesk-user";
const TOKEN_KEY = "rozedesk-token";

/* ── Save user after login ── */
export function saveSession(token: string, user: AuthUser): void {
  setToken(token);
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/* ── Read current user (client-side) ── */
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/* ── Check if a token exists (not validated — server validates) ── */
export function hasToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

/* ── Sign out — clear all auth state ── */
export function signOut(): void {
  clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

/* ── Role helpers ── */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

export function isSeeker(user: AuthUser | null): boolean {
  return user?.role === "seeker";
}

/**
 * getInitials — generate 2-letter initials from a full name.
 * Used when backend user has no avatar image.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
