/**
 * admin/loading.tsx — Skeleton shown while admin data loads.
 */
import React from "react";
import SkeletonCard from "@/components/dashboard/SkeletonCard";

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} showIcon />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[1,2].map(i => (
          <div key={i} className="rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] p-5 h-[200px] animate-pulse" aria-hidden="true"/>
        ))}
      </div>
      {/* Table */}
      <div className="rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-hidden">
        <div className="h-10 bg-[var(--bg-elevated)] animate-pulse" aria-hidden="true"/>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 border-t border-[var(--border-default)] px-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] animate-pulse flex-shrink-0" aria-hidden="true"/>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-1/3 rounded-full bg-[var(--bg-elevated)] animate-pulse" aria-hidden="true"/>
              <div className="h-2 w-1/4 rounded-full bg-[var(--bg-elevated)] animate-pulse" aria-hidden="true"/>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading admin panel…</span>
    </div>
  );
}
