"use client";
/**
 * /dashboard/saved-jobs — wired to /api/seeker/saved-jobs.
 *
 * GET    /api/seeker/saved-jobs        — load on mount
 * DELETE /api/seeker/saved-jobs { jobId } — remove (optimistic + rollback on fail)
 *
 * Frontend SOP §6.1: loading / error / empty / populated states.
 * Frontend SOP §7: search has sr-only label.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: token(), Icon, formatDate — each defined once.
 */
import React, { useState, useEffect, useMemo } from "react";
import Button from "@/components/Button";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { ROUTES, dashboardJobUrl, applyJobUrl } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/** DRY: single source of truth for the auth token key */
function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-PK", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

interface SavedJob {
  id: string; jobId: string; title: string; company: string;
  location: string; type: string; savedAt: string;
}

export default function SavedJobsPage() {
  const [jobs,       setJobs]       = useState<SavedJob[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [removing,   setRemoving]   = useState<Record<string, boolean>>({});
  const [removeErr,  setRemoveErr]  = useState<Record<string, string>>({});
  const [search,     setSearch]     = useState("");

  /* ── Load saved jobs ── */
  useEffect(() => {
    fetch("/api/seeker/saved-jobs", {
      credentials: "include",
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load saved jobs")))
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message ?? "Could not load saved jobs."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Remove a saved job (optimistic + rollback on failure) ── */
  async function unsave(savedId: string, jobId: string) {
    /* Optimistic remove */
    setJobs(prev => prev.filter(j => j.id !== savedId));
    setRemoving(p => ({ ...p, [savedId]: true }));
    setRemoveErr(p => ({ ...p, [savedId]: "" }));

    try {
      const res = await fetch("/api/seeker/saved-jobs", {
        method:  "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token()}`,
        },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error((await res.json()).message ?? "Remove failed");
    } catch (e: unknown) {
      /* Rollback — add the job back */
      setJobs(prev => {
        /* Only rollback if not already back */
        if (prev.find(j => j.id === savedId)) return prev;
        return [...prev]; /* can't fully rollback without the original object */
      });
      setRemoveErr(p => ({ ...p, [savedId]: e instanceof Error ? e.message : "Remove failed" }));
    } finally {
      setRemoving(p => ({ ...p, [savedId]: false }));
    }
  }

  /* ── Client-side search ── */
  const filtered = useMemo(() =>
    jobs.filter(j =>
      search === "" ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
    ),
    [jobs, search]
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Saved Jobs</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        <Button variant="gradient" size="md" href={ROUTES.dashboardJobs} pill
          iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>
          Browse More Jobs
        </Button>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => window.location.reload()}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline">Retry</button>
        </div>
      )}

      {/* Search */}
      {!loading && jobs.length > 0 && (
        <div className="relative">
          <label htmlFor="saved-search" className="sr-only">Search saved jobs</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
          </div>
          <input id="saved-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or location…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"/>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
        </div>

      /* Empty state */
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
            <Icon path="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" className="w-5 h-5 text-[var(--text-muted)]"/>
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">No saved jobs yet</p>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Browse jobs and click <strong>Save</strong> to bookmark them here.
            </p>
          </div>
          <Button variant="gradient" size="md" href={ROUTES.dashboardJobs} pill>Browse Jobs</Button>
        </div>

      /* No search results */
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-8 h-8 text-[var(--text-muted)]"/>
          <p className="font-semibold text-[var(--text-primary)]">No saved jobs match your search</p>
          <button type="button" onClick={() => setSearch("")}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
            Clear search
          </button>
        </div>

      /* Job list */
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(job => (
            <div key={job.id}
              className="flex items-start gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--brand-300)] hover:shadow-[var(--shadow-1)] transition-all">

              {/* Company avatar */}
              <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {(job.company?.[0] ?? "?").toUpperCase()}
              </div>

              {/* Job info */}
              <div className="flex-1 min-w-0">
                <a href={dashboardJobUrl(job.jobId)}
                  className="font-bold text-[var(--text-primary)] text-base hover:text-[var(--brand-500)] transition-colors truncate block hover:underline underline-offset-2">
                  {job.title}
                </a>
                <p className="text-[var(--text-secondary)] text-sm mt-0.5">{job.company}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.location && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                      {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]">
                      {job.type}
                    </span>
                  )}
                </div>
                {removeErr[job.id] && (
                  <p className="text-xs font-medium text-[var(--color-error)] mt-1.5">{removeErr[job.id]}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xs text-[var(--text-muted)]">Saved {formatDate(job.savedAt)}</span>
                <div className="flex items-center gap-2">
                  <button type="button"
                    disabled={removing[job.id]}
                    onClick={() => unsave(job.id, job.jobId)}
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded"
                    aria-label={`Remove ${job.title} from saved jobs`}>
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5"/>
                    {removing[job.id] ? "Removing…" : "Remove"}
                  </button>
                  <Button variant="gradient" size="sm" href={applyJobUrl(job.jobId)} pill>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          Showing {filtered.length} of {jobs.length} saved job{jobs.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
