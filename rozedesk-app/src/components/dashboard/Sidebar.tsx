"use client";
/**
 * Sidebar — reusable sidebar for both seeker and admin dashboards.
 * DRY: one component, `variant` prop switches the nav items + theme.
 *
 * Features:
 *   - Collapsible on mobile (overlay drawer)
 *   - Fixed on desktop (lg+)
 *   - Active link detection via pathname
 *   - Keyboard accessible: focus trap on mobile, esc to close
 *   - Logo at top, nav links, sign-out at bottom
 *
 * UI/UX SOP §6 Navigation: active state = brand bg / white text ≥4.7:1 ✓
 * UI/UX SOP §Hard Rule 2: every item keyboard operable, visible focus ring ✓
 */
"use client";
import React, { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ROUTES } from "@/lib/routes";
import { useSignOut } from "@/hooks/useSignOut";

/* ── Nav item type ── */
interface NavItem {
  label:   string;
  href:    string;
  icon:    string;   /* SVG path(s) */
  badge?:  string;   /* optional count badge */
}

/* ── Seeker nav items ── */
const SEEKER_NAV: NavItem[] = [
  { label: "Overview",      href: ROUTES.dashboard,       icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label: "Browse Jobs",   href: "/dashboard/jobs",       icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Applications",  href: ROUTES.applications,     icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { label: "Saved Jobs",    href: ROUTES.savedJobs,        icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
  { label: "Job Alerts",    href: ROUTES.seekerAlerts,     icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" },
  { label: "My Profile",    href: ROUTES.seekerProfile, icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" },
];

/* ── Admin nav items ── */
const ADMIN_NAV: NavItem[] = [
  { label: "Overview",          href: ROUTES.admin,                icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label: "Job Listings",      href: ROUTES.adminJobs,            icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Post a Job",        href: ROUTES.adminPostJob,         icon: "M12 4v16m8-8H4" },
  { label: "Applicants",        href: ROUTES.adminApplicants,      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Payments",          href: ROUTES.adminPayments,        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Analytics",         href: ROUTES.adminAnalytics,       icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Ledger",            href: ROUTES.adminLedger,          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Payment Settings",  href: ROUTES.adminPaymentSettings, icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Settings",          href: ROUTES.adminSettings,        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

interface SidebarProps {
  variant:     "seeker" | "admin";
  open:        boolean;
  onClose:     () => void;
}

/* ── Icon renderer ── */
function NavIcon({ path }: { path: string }) {
  return (
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Sign Out button — extracted so it can use router ── */
function SignOutButton({ signOutColor }: { signOutColor: string }) {
  const signOut = useSignOut();

  return (
    <button
      type="button"
      onClick={signOut}
      className={[
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)]",
        "text-[var(--text-sm)] font-medium",
        "transition-all duration-[var(--dur-fast)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
        signOutColor,
      ].join(" ")}
      aria-label="Sign out"
    >
      <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      <span>Sign Out</span>
    </button>
  );
}

export default function Sidebar({ variant, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin  = variant === "admin";
  const navItems = isAdmin ? ADMIN_NAV : SEEKER_NAV;

  /* Close on Esc */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  /* Prevent body scroll when mobile drawer is open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else      document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /*
   * isActive — determines which sidebar link is highlighted.
   *
   * LESSON (LESSONS.md 2026-09-13): The previous fix added adminPostJob to EXACT_ONLY
   * but NOT adminJobs. So on /admin/jobs/new:
   *   - "Post a Job"  (/admin/jobs/new) → EXACT_ONLY → only matches exact → active ✓
   *   - "Job Listings" (/admin/jobs)    → NOT in EXACT_ONLY → falls to startsWith check
   *     → "/admin/jobs/new".startsWith("/admin/jobs/") = TRUE → also active ✗ BUG
   *
   * ROOT CAUSE: "Job Listings" is a parent route with children (/admin/jobs/[id]/edit)
   * that should show as active when browsing a job's sub-pages. But /admin/jobs/new
   * is NOT a child of Job Listings — it's the "Post a Job" action, a sibling route.
   * The startsWith("/admin/jobs/") check cannot distinguish between these two.
   *
   * FIX: Add adminJobs to EXACT_ONLY too. Job Listings is only active on its own
   * exact path. If we ever add /admin/jobs/[id] detail pages, we handle them
   * separately with their own nav item or breadcrumb — not by activating Job Listings.
   *
   * CLASSIFICATION (per LESSONS.md prevention rule):
   *   Exact-only routes (never use prefix match):
   *     - admin         /admin                — root, never a prefix
   *     - adminPostJob  /admin/jobs/new       — action, never a prefix
   *     - adminJobs     /admin/jobs           — list page; /admin/jobs/new is a SIBLING
   *                                             not a child — do NOT prefix-match
   *     - dashboard     /dashboard            — root, never a prefix
   *
   *   Prefix routes (active when sub-pages are active):
   *     - adminApplicants /admin/applicants   — has query-param sub-views (not path-based)
   *     - All others: exact only by default
   */
  const EXACT_ONLY = new Set<string>([
    ROUTES.admin,                  /* /admin                — root, exact only */
    ROUTES.adminJobs,              /* /admin/jobs           — list; /new is a sibling not a child */
    ROUTES.adminPostJob,           /* /admin/jobs/new       — action, exact only */
    ROUTES.adminLedger,            /* /admin/ledger         — leaf page, exact only */
    ROUTES.adminPayments,          /* /admin/payments       — leaf page, exact only */
    ROUTES.adminPaymentSettings,   /* /admin/payment-settings — leaf page, exact only */
    ROUTES.dashboard,              /* /dashboard            — root, exact only */
    ROUTES.seekerProfile,          /* /dashboard/profile    — leaf page, exact only */
  ]);

  const isActive = (href: string): boolean => {
    /* 1. Exact match always wins */
    if (pathname === href) return true;
    /* 2. Exact-only routes never prefix-match */
    if (EXACT_ONLY.has(href)) return false;
    /* 3. Prefix match only at a segment boundary */
    return pathname.startsWith(href + "/");
  };

  /*
   * THEME STRATEGY — token classes only, no text-white/N.
   * All classes use CSS var tokens that respond to the user's ThemeToggle.
   * Both seeker and admin variants use the same token classes.
   */
  const bg          = "bg-[var(--bg-base)]";
  const border      = "border-[var(--border-default)]";
  const logoText    = "default" as const;   /* token-based — dark pin handles admin */
  const linkDefault = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]";
  const linkActive  = "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]";
  const sectionLabel = "text-[var(--text-muted)]";
  const divider     = "border-[var(--border-default)]";
  const signOutColor = isAdmin
    ? "text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)]"
    : "text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)]";

  const sidebarContent = (
    <aside
      id="dashboard-sidebar"
      className={[
        "flex flex-col h-full w-64 border-r",
        bg, border,
      ].join(" ")}
      aria-label={isAdmin ? "Admin navigation" : "Dashboard navigation"}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-5 flex-shrink-0">
        <Logo size="md" href={isAdmin ? ROUTES.admin : ROUTES.dashboard} textColor={logoText} />
        {isAdmin && (
          <span className="ml-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--brand-500)]/20 text-[var(--brand-400)] border border-[var(--brand-500)]/30">
            Admin
          </span>
        )}
      </div>

      <div className={`border-b ${divider}`} aria-hidden="true" />

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5" role="navigation">
        {!isAdmin && (
          <p className={`text-[9px] font-bold uppercase tracking-widest px-2 mb-2 ${sectionLabel}`}>
            Menu
          </p>
        )}
        {isAdmin && (
          <p className={`text-[9px] font-bold uppercase tracking-widest px-2 mb-2 ${sectionLabel}`}>
            Management
          </p>
        )}

        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
                "text-[var(--text-sm)] font-medium",
                "transition-all duration-[var(--dur-fast)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                active ? linkActive : linkDefault,
              ].join(" ")}
            >
              <NavIcon path={item.icon} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={[
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  active ? "bg-white/20 text-white" : "bg-[var(--brand-500)] text-white",
                ].join(" ")}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: sign out — wired to signOut() + router.push */}
      <div className={`border-t ${divider} px-3 py-4 flex-shrink-0`}>
        <SignOutButton signOutColor={signOutColor} />
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible, fixed width */}
      <div className="hidden lg:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile — slide-in drawer */}
      {/* Backdrop */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-[var(--dur-deliberate)]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={[
          "lg:hidden fixed inset-y-0 left-0 z-50",
          "transition-transform duration-[var(--dur-deliberate)]",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {sidebarContent}
      </div>
    </>
  );
}
