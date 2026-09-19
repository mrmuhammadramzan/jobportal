"use client";
/**
 * SaveJobButton — reusable bookmark toggle wired to /api/seeker/saved-jobs.
 *
 * Props:
 *   jobId   — the job's database ID
 *   variant — "card" (icon + text, compact) | "detail" (full-width, in sidebar)
 *
 * Behaviour:
 *   - Unauthenticated → redirects to /signin
 *   - POST  /api/seeker/saved-jobs  { jobId } to save
 *   - DELETE /api/seeker/saved-jobs { jobId } to unsave
 *
 * DRY: single implementation used in:
 *   - /jobs/[id]/page.tsx          (detail page sidebar)
 *   - /dashboard/jobs/page.tsx     (dashboard browse cards)
 *   - /jobs/page.tsx               (public browse cards)
 *
 * Frontend SOP §6.1: loading / saved / unsaved states all handled.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 */
import React, { useState } from "react";
import { ROUTES } from "@/lib/routes";

function tok(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

interface Props {
  jobId:    string;
  /** "card" = compact icon+text button for list cards; "detail" = full-width sidebar button */
  variant?: "card" | "detail";
}

export default function SaveJobButton({ jobId, variant = "card" }: Props) {
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    /* Prevent parent <a> / card click from firing */
    e.preventDefault();
    e.stopPropagation();

    if (!tok()) { window.location.href = ROUTES.signIn; return; }

    setLoading(true);
    try {
      await fetch("/api/seeker/saved-jobs", {
        method:  saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${tok()}`,
        },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      });
      setSaved(prev => !prev);
    } catch { /* silent — state unchanged */ }
    finally  { setLoading(false); }
  }

  /* ── Compact card variant ── */
  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-label={saved ? "Remove from saved jobs" : "Save this job"}
        className={[
          "flex items-center gap-1 text-xs font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded",
          "disabled:opacity-40",
          saved
            ? "text-[var(--brand-500)]"
            : "text-[var(--text-muted)] hover:text-[var(--brand-500)]",
        ].join(" ")}>
        <svg viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth="1.8"
          className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
        {loading ? "…" : saved ? "Saved" : "Save"}
      </button>
    );
  }

  /* ── Full-width detail variant ── */
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved jobs" : "Save this job"}
      className={[
        "w-full h-10 flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border text-sm font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        saved
          ? "bg-[color-mix(in_srgb,var(--brand-500)_10%,transparent)] border-[var(--brand-400)] text-[var(--brand-500)]"
          : "bg-[var(--bg-base)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--brand-500)]",
      ].join(" ")}>
      <svg viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8"
        className="w-4 h-4 flex-shrink-0" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      {loading ? "Saving…" : saved ? "Saved" : "Save Job"}
    </button>
  );
}
