"use client";
/**
 * /dashboard layout — Job Seeker shell.
 *
 * HYDRATION FIX:
 * Never read localStorage in useState initializer — server and client
 * render differently, causing "SK" vs "MA" mismatch.
 * Instead: start with empty string on both, update AFTER mount via useEffect.
 *
 * LESSON: Any value from localStorage must be read inside useEffect,
 * never in useState(() => ...) initializer for SSR-rendered layouts.
 *
 * DRY: Sidebar, DashboardHeader imported — never rebuilt inline.
 */
import React, { useState, useEffect } from "react";
import Sidebar         from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth, useUserInitials } from "@/context/AuthContext";
import { getStoredUser, getInitials } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const contextInitials = useUserInitials("SK");

  /* Start with empty — populated after mount to avoid SSR/client mismatch */
  const [mounted,       setMounted]       = useState(false);
  const [cachedName,    setCachedName]    = useState("");
  const [cachedInit,    setCachedInit]    = useState("SK");

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCachedName(stored.name ?? "");
      setCachedInit(stored.initials || getInitials(stored.name) || "SK");
    }
    setMounted(true);
  }, []);

  /* After mount: prefer live AuthContext, fall back to localStorage cache */
  const displayName     = mounted ? ((user?.name     ?? cachedName) || "")  : "";
  const displayInitials = mounted ? ((contextInitials !== "SK" ? contextInitials : cachedInit))  : "SK";

  return (
    /*
     * Layout strategy:
     *  - Mobile (< lg): NO sidebar in the flex row. Seeker uses bottom nav (fixed overlay).
     *    The <Sidebar> component renders only its fixed bottom-nav element on mobile.
     *  - Desktop (lg+): flex row — sidebar (fixed 256px) + main content column.
     */
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg-base)]">
      {/* Sidebar — on mobile renders ONLY the bottom nav overlay (not in flex row) */}
      <Sidebar
        variant="seeker"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content column — takes full width on mobile */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden w-full">
        <DashboardHeader
          variant="seeker"
          pageTitle="My Dashboard"
          userName={displayName}
          userInitials={displayInitials}
          notifCount={0}
          menuOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-base)]"
        >
          {/*
           * px-3 sm:px-6 — tight on mobile, comfortable on tablet+
           * pb safe area: bottom nav height + extra breathing room
           * lg:pb-8 — desktop has no bottom nav
           */}
          <div className="w-full max-w-3xl lg:max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-6 lg:py-8
            pb-[calc(var(--bottom-nav-height,64px)+20px)] lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
