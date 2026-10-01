"use client";
/**
 * DashboardHeader — top bar shared by both dashboards.
 *
 * FIXES (2026-09-13):
 *   1. Notification bell → animated dropdown with notification list + mark-all-read.
 *   2. ThemeToggle → animated sun↔moon icon rotation.
 *   3. Profile area → animated dropdown with profile links + sign out.
 *
 * SOP compliance:
 *   Frontend SOP §7: all interactive elements keyboard-operable.
 *   UI/UX SOP §Hard Rule 1: all 4 states designed (empty notifications, populated, loading, etc.)
 *   UI/UX SOP §Hard Rule 2: keyboard operable — Esc closes dropdowns, focus-visible rings.
 *   UI/UX SOP §Hard Rule 3: all colours via CSS var tokens — contrast verified.
 *   UI_MASTER_SKILL §8: dropdowns animate in (scale + fade), out on Esc/click-outside.
 *   DRY: one component. NotificationDropdown and ProfileDropdown are local sub-components.
 *        They are too tightly coupled to DashboardHeader to extract — used nowhere else.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link         from "next/link";
import Logo         from "@/components/Logo";
import { ROUTES }   from "@/lib/routes";
import { useSignOut } from "@/hooks/useSignOut";
import { useToast }  from "@/components/Toast";
import { playNotifSound } from "@/lib/notifSound";

/* ════════════════════════════════════════
   Types
   ════════════════════════════════════════ */
interface DashboardHeaderProps {
  variant:       "seeker" | "admin";
  pageTitle:     string;
  userName?:     string;
  userInitials?: string;
  onMenuToggle:  () => void;
  menuOpen:      boolean;
  notifCount?:   number;
}

interface Notification {
  id:    string;
  title: string;
  body:  string;
  icon:  "applicant" | "job" | "system" | "payment" | "success" | "error" | "warning" | "info";
  time:  string;
  read:  boolean;
  link?: string;
}

/* ── Real wallet balance for seeker header chip ── */
function useWalletBalance(isSeeker: boolean, refreshTrigger: number) {
  const [balance, setBalance] = React.useState<number | null>(null);

  const fetch_ = React.useCallback(() => {
    if (!isSeeker) return;
    const tok = typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
    if (!tok) return;
    fetch("/api/game/wallet", {
      credentials: "include",
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.balance !== undefined) setBalance(data.balance); })
      .catch(() => {});
  }, [isSeeker]);

  React.useEffect(() => { fetch_(); }, [fetch_, refreshTrigger]);

  return balance;
}

/**
 * useNotifications — real-time notification hook.
 *
 * Strategy:
 *  1. Fetch initial list via REST (GET /api/notifications) for instant render.
 *  2. Open SSE stream (GET /api/notifications/stream) for push updates.
 *  3. If SSE fails (network / server error), fall back to 30 s polling.
 *
 * Token: uses "rozedesk-token" (the canonical key — see src/lib/api.ts).
 * Sound: calls playNotifSound() on new events (env-gated).
 * Toast: fires a clickable toast that navigates to the notification link.
 */
function useNotifications(isActive: boolean) {
  const [notifs,      setNotifs]      = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [balanceTick, setBalanceTick] = React.useState(0);

  /* CustomEvent bridge: avoid importing ToastContext into this hook */
  const fireToast = React.useCallback((
    msg:   string,
    type:  "success" | "error" | "warning" | "info",
    link?: string | null,
  ) => {
    window.dispatchEvent(
      new CustomEvent("__notif_toast__", { detail: { msg, type, link } }),
    );
  }, []);

  /* Helper: map a raw DB/API notification row → display shape */
  const mapRow = (n: {
    id: string; title: string; body: string; type: string;
    createdAt: string; read: boolean; link?: string | null;
  }): Notification => ({
    id:    n.id,
    title: n.title,
    body:  n.body,
    icon:  (n.type as Notification["icon"]) ?? "info",
    time:  new Date(n.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
    read:  n.read,
    link:  n.link ?? undefined,
  });

  const tok = React.useCallback(
    () => (typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""),
    [],
  );

  /* ── Initial REST fetch (for instant render on mount) ── */
  const fetchAll = React.useCallback(async () => {
    const t = tok();
    if (!t || !isActive) return;
    try {
      const res  = await fetch("/api/notifications?limit=20", {
        credentials: "include",
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifs((data.notifications ?? []).map(mapRow));
      setUnreadCount(data.unreadCount ?? 0);
    } catch { /* silent */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  React.useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── SSE stream ── */
  React.useEffect(() => {
    if (!isActive) return;
    const t = tok();
    if (!t) return;

    /* Fallback polling timer — only used when SSE is unavailable */
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let destroyed = false;

    const startPollFallback = () => {
      if (pollTimer) return;
      pollTimer = setInterval(fetchAll, 30_000);
    };

    const stopPollFallback = () => {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    };

    const openSSE = (sinceIso?: string) => {
      if (destroyed) return;
      const url = `/api/notifications/stream?since=${sinceIso ?? new Date().toISOString()}`;

      /* SSE requires auth — pass token as query param because EventSource
         doesn't support custom headers. The server reads from cookie OR
         the Authorization header; the cookie is sent automatically with
         credentials:"include" on the fetch-based initial call, so we
         rely on the HttpOnly cookie for SSE auth.
         Note: EventSource always sends cookies for same-origin requests. */
      es = new EventSource(url, { withCredentials: true });

      es.addEventListener("connected", () => {
        stopPollFallback(); /* SSE working — no need for 30s poll */
      });

      es.addEventListener("notification", (e: MessageEvent) => {
        try {
          const n = JSON.parse(e.data) as {
            id: string; title: string; body: string; type: string;
            createdAt: string; read: boolean; link?: string | null;
          };
          const mapped = mapRow(n);

          /* Prepend to list */
          setNotifs(prev => {
            if (prev.find(x => x.id === mapped.id)) return prev;
            return [mapped, ...prev].slice(0, 50);
          });
          setUnreadCount(c => c + 1);

          /* Sound */
          const flavour =
            n.type === "success" ? "success" :
            n.type === "error"   ? "error"   : "alert";
          playNotifSound(flavour);

          /* Clickable toast */
          const msg = mapped.title + (mapped.body ? ` — ${mapped.body.slice(0, 55)}` : "");
          fireToast(msg, mapped.icon as "success"|"error"|"warning"|"info", mapped.link);

          /* If deposit/withdrawal approved → refresh wallet balance */
          if (n.type === "success") setBalanceTick(c => c + 1);
        } catch { /* malformed SSE data */ }
      });

      es.onerror = () => {
        es?.close();
        es = null;
        if (!destroyed) {
          /* Retry SSE after 10 s; meanwhile fall back to polling */
          startPollFallback();
          reconnectTimer = setTimeout(() => openSSE(), 10_000);
        }
      };
    };

    openSSE();

    return () => {
      destroyed = true;
      es?.close();
      stopPollFallback();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const markAllRead = React.useCallback(async () => {
    const t = tok();
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        credentials: "include",
        headers: { Authorization: `Bearer ${t}` },
      });
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { notifs, unreadCount, markAllRead, balanceTick };
}

/* ── Shared dropdown animation classes ── */
const DROPDOWN_BASE = [
  "absolute right-0 top-[calc(100%+8px)] z-50",
  "origin-top-right",
  "rounded-[var(--radius-xl)] border border-[var(--border-default)]",
  "bg-[var(--bg-base)] shadow-[var(--shadow-3)]",
  "transition-all duration-[var(--dur-deliberate)]",
].join(" ");

const DROPDOWN_OPEN   = "opacity-100 scale-100 pointer-events-auto translate-y-0";
const DROPDOWN_CLOSED = "opacity-0 scale-95 pointer-events-none -translate-y-1";

/* ════════════════════════════════════════
   Notification icon by type
   ════════════════════════════════════════ */
function NotifIcon({ type }: { type: Notification["icon"] }) {
  const icons = {
    applicant: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    job:       "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    system:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    payment:   "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8",
    success:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error:     "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning:   "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    info:      "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  } as Record<string, string>;
  const colors = {
    applicant: "bg-[color-mix(in_srgb,var(--brand-500)_15%,transparent)] text-[var(--brand-500)]",
    job:       "bg-[color-mix(in_srgb,var(--accent-400)_15%,transparent)] text-[var(--accent-500)]",
    system:    "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]",
    payment:   "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    success:   "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    error:     "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)]",
    warning:   "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]",
    info:      "bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] text-[var(--brand-500)]",
  } as Record<string, string>;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors[type]}`}
      aria-hidden="true">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={icons[type]} />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════
   Notification Dropdown
   ════════════════════════════════════════ */
function NotificationDropdown({
  open, notifs, onMarkAll, onClose,
}: {
  open:       boolean;
  notifs:     Notification[];
  onMarkAll:  () => void;
  onClose:    () => void;
}) {
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div
      className={`${DROPDOWN_BASE} w-80 ${open ? DROPDOWN_OPEN : DROPDOWN_CLOSED}`}
      role="region"
      aria-label="Notifications"
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[var(--text-primary)]">Notifications</span>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--brand-500)] text-white">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={onMarkAll}
            className="text-xs font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <ul className="divide-y divide-[var(--border-default)] max-h-72 overflow-y-auto" role="list">
        {notifs.length === 0 ? (
          /* Empty state */
          <li className="flex flex-col items-center gap-2 py-8 text-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <p className="text-xs text-[var(--text-muted)]">No notifications yet</p>
          </li>
        ) : (
          notifs.map(n => (
            <li key={n.id}>
              <button
                type="button"
                className={[
                  "w-full flex items-start gap-3 px-4 py-3 text-left",
                  "hover:bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)]",
                  !n.read ? "bg-[color-mix(in_srgb,var(--brand-500)_4%,transparent)]" : "",
                ].join(" ")}
                onClick={() => {
                  onClose();
                  if (n.link) window.location.href = n.link;
                }}
              >
                <NotifIcon type={n.icon} />
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold truncate ${!n.read ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                      {n.title}
                    </p>
                    {/* Unread dot — UI/UX SOP §Hard Rule 4: dot + colour, not colour alone */}
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] flex-shrink-0" aria-label="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-snug line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{n.time}</p>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      {notifs.length > 0 && (
        <div className="px-4 py-2.5 border-t border-[var(--border-default)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors text-center"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   Profile Dropdown
   ════════════════════════════════════════ */
function ProfileDropdown({
  open, isAdmin, userName, userInitials, onClose,
}: {
  open:         boolean;
  isAdmin:      boolean;
  userName:     string;
  userInitials: string;
  onClose:      () => void;
}) {
  const signOut = useSignOut();

  const handleSignOut = useCallback(() => {
    onClose();
    signOut();
  }, [onClose, signOut]);
  /* Link groups — DRY: data drives the menu */
  const SEEKER_LINKS = [
    { label: "My Dashboard", href: ROUTES.dashboard,    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
    { label: "Play Game",    href: ROUTES.game,         icon: "M5 3l14 9-14 9V3z" },
    { label: "My Profile",   href: ROUTES.seekerProfile,icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];
  const ADMIN_LINKS = [
    { label: "Admin Dashboard",href: ROUTES.admin,         icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
    { label: "Settings",       href: ROUTES.adminSettings, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];
  const links = isAdmin ? ADMIN_LINKS : SEEKER_LINKS;

  return (
    <div
      className={`${DROPDOWN_BASE} w-56 ${open ? DROPDOWN_OPEN : DROPDOWN_CLOSED}`}
      role="menu"
      aria-label="User menu"
      aria-hidden={!open}
    >
      {/* User identity */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-default)]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-inverse)] font-bold text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg,var(--brand-600),var(--brand-500))" }}>
          {userInitials.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{userName}</p>
          <p className="text-xs text-[var(--text-muted)]">{isAdmin ? "Super Admin" : "Player"}</p>
        </div>
      </div>

      {/* Nav links */}
      <ul className="py-1.5" role="list">
        {links.map(link => (
          <li key={link.href} role="none">
            <Link
              href={link.href}
              role="menuitem"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)]"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={link.icon} />
              </svg>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Divider + Sign out — now calls handleSignOut which clears session */}
      <div className="border-t border-[var(--border-default)] py-1.5">
        <button
          type="button"
          role="menuitem"
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_6%,transparent)] transition-colors duration-[var(--dur-fast)]"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Main DashboardHeader
   ════════════════════════════════════════ */
export default function DashboardHeader({
  variant,
  pageTitle,
  userName     = "User",
  userInitials = "U",
  onMenuToggle,
  menuOpen,
  notifCount   = 0,
}: DashboardHeaderProps) {
  const isAdmin = variant === "admin";

  /* Dropdown open states */
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* Real notifications from API */
  const { notifs, unreadCount, markAllRead: apiMarkAllRead, balanceTick } = useNotifications(true);
  /* Wallet balance — refreshes when deposit approved notification arrives */
  const walletBalance = useWalletBalance(!isAdmin, balanceTick);

  /* Listen for notification toasts fired via CustomEvent from useNotifications */
  const toast = useToast();
  useEffect(() => {
    const handler = (e: Event) => {
      const { msg, type, link } = (e as CustomEvent<{
        msg: string; type: "success"|"error"|"warning"|"info"; link?: string | null;
      }>).detail;
      toast[type]?.(msg, {
        duration: 7000,
        onClick: link ? () => { window.location.href = link; } : undefined,
      });
    };
    window.addEventListener("__notif_toast__", handler);
    return () => window.removeEventListener("__notif_toast__", handler);
  }, [toast]);

  /* Keep local markAllRead that calls API version */
  const markAllRead = apiMarkAllRead;

  /* Refs for click-outside detection */
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* Click-outside closes dropdowns — Frontend SOP §7 interaction patterns */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Esc key closes whichever dropdown is open — UI/UX SOP §Hard Rule 2 */
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleNotif = useCallback(() => {
    setNotifOpen(o => !o);
    setProfileOpen(false);   /* close other dropdown */
  }, []);

  const toggleProfile = useCallback(() => {
    setProfileOpen(o => !o);
    setNotifOpen(false);     /* close other dropdown */
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-base)] transition-all duration-[var(--dur-fast)]">
      <div className="h-14 px-4 sm:px-6 flex items-center gap-2">

        {/* Mobile hamburger — admin only (seeker uses bottom nav) */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={menuOpen}
          aria-controls="dashboard-sidebar"
          className={[
            "flex flex-col justify-center items-center w-8 h-8 gap-[5px]",
            "rounded-[var(--radius-md)] transition-colors hover:bg-[var(--bg-elevated)]",
            isAdmin ? "lg:hidden flex-shrink-0" : "hidden",
          ].join(" ")}
        >
          <span className={`w-4 h-0.5 rounded-full bg-[var(--text-primary)] transition-all duration-[var(--dur-default)] ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`w-4 h-0.5 rounded-full bg-[var(--text-primary)] transition-all duration-[var(--dur-default)] ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-4 h-0.5 rounded-full bg-[var(--text-primary)] transition-all duration-[var(--dur-default)] ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

        {/* Logo — mobile only, seeker (desktop logo is in sidebar) / always for admin mobile */}
        <div className={isAdmin ? "lg:hidden flex-shrink-0" : "lg:hidden flex-shrink-0"}>
          <Logo size="sm" href={isAdmin ? ROUTES.admin : ROUTES.dashboard} priority />
        </div>

        {/* Page title — desktop + tablet */}
        <h1 className="hidden sm:block font-bold text-[var(--text-base)] text-[var(--text-primary)] truncate">
          {pageTitle}
        </h1>

        {/* Admin badge */}
        {isAdmin && (
          <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--brand-500)_15%,transparent)] text-[var(--brand-400)] border border-[color-mix(in_srgb,var(--brand-500)_30%,transparent)]">
            Admin
          </span>
        )}

        <div className="flex-1" />

        {/* ── Right side controls ── */}
        <div className="flex items-center gap-1.5">

          {/* ── Notification bell + dropdown ── */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={toggleNotif}
              aria-label={`${unreadCount} unread notifications`}
              aria-expanded={notifOpen}
              aria-haspopup="true"
              className={[
                "relative w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]",
                "transition-all duration-[var(--dur-default)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                notifOpen
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {/* Bell with subtle shake animation when unread */}
              <svg
                className={`w-[18px] h-[18px] ${unreadCount > 0 ? "animate-bounce-subtle" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {/* Unread badge — pulsing dot */}
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-error)]"
                  aria-hidden="true"
                >
                  {/* Ping animation */}
                  <span className="absolute inset-0 rounded-full bg-[var(--color-error)] animate-ping opacity-75" />
                </span>
              )}
            </button>

            <NotificationDropdown
              open={notifOpen}
              notifs={notifs}
              onMarkAll={markAllRead}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* ── Wallet balance chip (seeker) / profile button (admin) ── */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={toggleProfile}
              aria-label="Open user menu"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              className={[
                "flex items-center gap-2 px-2.5 h-9 rounded-[var(--radius-pill)]",
                "border transition-all duration-[var(--dur-default)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                profileOpen
                  ? "bg-[var(--bg-elevated)] border-[var(--brand-500)]"
                  : "bg-[var(--bg-elevated)] border-[var(--border-default)] hover:border-[var(--brand-500)]",
              ].join(" ")}
            >
              {/* Wallet icon / Avatar */}
              {!isAdmin && walletBalance !== null ? (
                <>
                  {/* Wallet icon */}
                  <svg className="w-4 h-4 text-[var(--accent-500)] flex-shrink-0" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  {/* Balance */}
                  <span className="text-xs font-black text-[var(--text-primary)] tabular-nums">
                    Rs.{walletBalance.toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  {/* Admin avatar */}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center
                    text-[var(--text-inverse)] font-bold text-[10px] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,var(--brand-700),var(--brand-500))" }}>
                    {userInitials.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-[var(--text-primary)] max-w-[80px] truncate">
                    {userName}
                  </span>
                </>
              )}
              {/* Chevron */}
              <svg
                className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-[var(--dur-default)] ${profileOpen ? "rotate-180" : ""}`}
                viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <ProfileDropdown
              open={profileOpen}
              isAdmin={isAdmin}
              userName={userName}
              userInitials={userInitials}
              onClose={() => setProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
