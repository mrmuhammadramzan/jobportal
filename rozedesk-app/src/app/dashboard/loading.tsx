/**
 * dashboard/loading.tsx — Skeleton shown while seeker dashboard data loads.
 * Next.js App Router automatically renders this during page suspense.
 * DRY: SkeletonCard reused — never style a skeleton inline.
 */
import React from "react";
import SkeletonCard from "@/components/dashboard/SkeletonCard";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} showIcon />
        ))}
      </div>
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] p-5 h-[180px] animate-pulse" aria-hidden="true" />
        <div className="rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] p-5 h-[180px] animate-pulse" aria-hidden="true" />
      </div>
      {/* Applications skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-40 rounded-full bg-[var(--bg-elevated)] animate-pulse" aria-hidden="true" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} showIcon />
        ))}
      </div>
      <span className="sr-only">Loading your dashboard…</span>
    </div>
  );
}
