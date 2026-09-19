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
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar
        variant="seeker"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader
          variant="seeker"
          pageTitle="My Dashboard"
          userName={displayName}
          userInitials={displayInitials}
          notifCount={0}
          menuOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <main id="dashboard-main" className="flex-1 overflow-y-auto bg-[var(--bg-base)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
