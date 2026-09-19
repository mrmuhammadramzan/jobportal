/**
 * SkeletonCard — reusable animated loading skeleton.
 * DRY: one skeleton component used in loading.tsx files.
 * UI/UX SOP §Hard Rule 1: loading state is designed, not blank.
 */
import React from "react";

interface SkeletonCardProps {
  lines?:    number;   /* number of text lines to show */
  showIcon?: boolean;
  className?: string;
}

function SkeletonLine({ w = "full", h = "3" }: { w?: string; h?: string }) {
  return (
    <div
      className={`h-${h} w-${w} rounded-full bg-[var(--bg-elevated)] animate-pulse`}
      aria-hidden="true"
    />
  );
}

export default function SkeletonCard({ lines = 2, showIcon = true, className = "" }: SkeletonCardProps) {
  return (
    <div
      className={[
        "rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] p-5",
        "flex flex-col gap-3",
        className,
      ].join(" ")}
      role="status"
      aria-label="Loading…"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] animate-pulse flex-shrink-0" aria-hidden="true" />
        )}
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonLine w="3/4" h="4" />
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <SkeletonLine key={i} w={i % 2 === 0 ? "full" : "5/6"} h="3" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading content, please wait…</span>
    </div>
  );
}
