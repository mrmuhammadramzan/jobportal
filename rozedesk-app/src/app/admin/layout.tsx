"use client";
/**
 * /admin layout — Admin shell.
 *
 * HYDRATION FIX: localStorage read moved to useEffect (after mount only).
 * See dashboard/layout.tsx for explanation.
 *
 * Login page renders standalone — no sidebar/header.
 * DRY: Sidebar, DashboardHeader imported.
 */
import React, { useState, useEffect } from "react";
import { usePathname }  from "next/navigation";
import Sidebar          from "@/components/dashboard/Sidebar";
import DashboardHeader  from "@/components/dashboard/DashboardHeader";
import { useAuth, useUserInitials } from "@/context/AuthContext";
import { getStoredUser, getInitials } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname         = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user }        = useAuth();
  const contextInitials  = useUserInitials("SA");

  const [mounted,    setMounted]    = useState(false);
  const [cachedName, setCachedName] = useState("");
  const [cachedInit, setCachedInit] = useState("SA");

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCachedName(stored.name ?? "");
      setCachedInit(stored.initials || getInitials(stored.name) || "SA");
    }
    setMounted(true);
  }, []);

  /* Login page must render standalone — no sidebar/header */
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const displayName     = mounted ? ((user?.name ?? cachedName) || "Admin") : "Admin";
  const displayInitials = mounted ? (contextInitials !== "SA" ? contextInitials : cachedInit) : "SA";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar
        variant="admin"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[var(--bg-surface)]">
        <DashboardHeader
          variant="admin"
          pageTitle="Admin Panel"
          userName={displayName}
          userInitials={displayInitials}
          notifCount={0}
          menuOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <main id="admin-main" className="flex-1 overflow-y-auto bg-[var(--bg-surface)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
