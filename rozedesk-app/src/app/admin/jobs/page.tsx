"use client";
/**
 * /admin/jobs — Manage all job listings.
 * GET    /api/admin/jobs         — load on mount
 * PATCH  /api/admin/jobs/[id]    — close (CLOSED) or reopen (ACTIVE)
 * DELETE /api/admin/jobs/[id]    — permanently delete
 *
 * All three actions show a confirmation modal before executing.
 * Frontend SOP §6.1: loading / empty / populated / error states.
 * UI/UX SOP §Hard Rule 5: destructive actions require confirmation.
 * DRY: authHeaders(), Icon, ConfirmModal — each defined once.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link   from "next/link";
import Button from "@/components/Button";
import Badge  from "@/components/Badge";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { ROUTES, adminEditJobUrl, adminJobApplicantsUrl } from "@/lib/routes";
import { useToast } from "@/components/Toast";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

interface Job {
  id: string; title: string; company: string; category: string;
  location: string; type: string; applicants: number; createdAt: string; status: string;
}

type StatusFilter = "All" | "Active" | "Closed";
type ActionType   = "close" | "reopen" | "delete";

const ACTION_META: Record<ActionType, { heading: string; body: (title: string) => string; confirm: string; danger: boolean }> = {
  close:  {
    heading: "Close Listing?",
    body:    t => `"${t}" will be marked as Closed. Applicants already submitted are not affected.`,
    confirm: "Yes, Close It",
    danger:  false,
  },
  reopen: {
    heading: "Reopen Listing?",
    body:    t => `"${t}" will be marked Active again and visible to job seekers.`,
    confirm: "Yes, Reopen It",
    danger:  false,
  },
  delete: {
    heading: "Delete Listing?",
    body:    t => `"${t}" will be permanently deleted along with all its applications. This cannot be undone.`,
    confirm: "Yes, Delete It",
    danger:  true,
  },
};

export default function AdminJobsPage() {
  const [jobs,          setJobs]          = useState<Job[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>("All");
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; action: ActionType; title: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState("");
  const toast = useToast();

  /* ── Load jobs ── */
  useEffect(() => {
    fetch("/api/admin/jobs", { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load jobs")))
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    jobs.filter(j => {
      const s = j.status === "ACTIVE" ? "Active" : "Closed";
      const matchSearch = search === "" ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || s === statusFilter;
      return matchSearch && matchStatus;
    }),
    [jobs, search, statusFilter]
  );

  const counts = useMemo(() => ({
    All:    jobs.length,
    Active: jobs.filter(j => j.status === "ACTIVE").length,
    Closed: jobs.filter(j => j.status !== "ACTIVE").length,
  }), [jobs]);

  /* ── Execute confirmed action ── */
  const confirmAction = useCallback(async () => {
    if (!confirmTarget) return;
    setActionLoading(true); setActionError("");

    try {
      if (confirmTarget.action === "delete") {
        const res = await fetch(`/api/admin/jobs/${confirmTarget.id}`, {
          method: "DELETE", headers: authHeaders(), credentials: "include",
        });
        if (!res.ok) throw new Error((await res.json()).message);
        setJobs(prev => prev.filter(j => j.id !== confirmTarget.id));

      } else {
        const newStatus = confirmTarget.action === "close" ? "CLOSED" : "ACTIVE";
        const res = await fetch(`/api/admin/jobs/${confirmTarget.id}`, {
          method: "PATCH", headers: authHeaders(), credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        setJobs(prev => prev.map(j =>
          j.id === confirmTarget.id ? { ...j, status: newStatus } : j
        ));
      }
      setConfirmTarget(null);
      toast.success(
        confirmTarget.action === "delete" ? `"${confirmTarget.title}" deleted.` :
        confirmTarget.action === "close"  ? `"${confirmTarget.title}" closed.` :
        `"${confirmTarget.title}" reopened.`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Action failed. Please try again.";
      setActionError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  }, [confirmTarget]);

  const meta = confirmTarget ? ACTION_META[confirmTarget.action] : null;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Job Listings</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${counts.Active} active · ${counts.Closed} closed`}
          </p>
        </div>
        <Button variant="gradient" size="md" href={ROUTES.adminPostJob} pill glow
          iconLeft={<Icon path="M12 4v16m8-8H4" className="w-4 h-4" />}>
          Post New Job
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0" />
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => setError("")}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            Dismiss
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] flex-shrink-0"
          role="tablist" aria-label="Filter by status">
          {(["All","Active","Closed"] as StatusFilter[]).map(tab => (
            <button key={tab} type="button" role="tab" aria-selected={statusFilter === tab}
              onClick={() => setStatusFilter(tab)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap",
                "transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                statusFilter === tab
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}>
              {tab}
              <span className={[
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                statusFilter === tab ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]",
              ].join(" ")}>{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <label htmlFor="job-search" className="sr-only">Search jobs</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4" />
          </div>
          <input id="job-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or location…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col gap-2">{[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-8 h-8 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">
            {search ? "No jobs match your search" : statusFilter !== "All" ? `No ${statusFilter.toLowerCase()} jobs` : "No jobs yet"}
          </p>
          {!search && statusFilter === "All" && (
            <Button variant="gradient" size="md" href={ROUTES.adminPostJob} pill>Post a Job</Button>
          )}
        </div>
      ) : (
        <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
            {[
              ["col-span-4","Title / Company"],
              ["col-span-2 hidden lg:block","Category"],
              ["col-span-1 hidden md:block","Location"],
              ["col-span-1","Apps"],
              ["col-span-1 hidden sm:block","Status"],
              ["col-span-3","Actions"],
            ].map(([cls, label]) => (
              <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>
                {label}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((job, i) => {
            const isActive = job.status === "ACTIVE";
            return (
              <div key={job.id}
                className={[
                  "grid grid-cols-12 gap-3 items-center px-5 py-4",
                  "hover:bg-[var(--bg-surface)] transition-colors duration-[var(--dur-fast)]",
                  i < filtered.length - 1 ? "border-b border-[var(--border-default)]" : "",
                ].join(" ")}>

                {/* Title + company */}
                <div className="col-span-4 flex flex-col gap-0.5 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{job.title}</p>
                  <p className="text-[var(--text-muted)] text-xs truncate">{job.company} · {job.type}</p>
                </div>

                {/* Category */}
                <p className="col-span-2 text-[var(--text-secondary)] text-sm hidden lg:block truncate">{job.category}</p>

                {/* Location */}
                <p className="col-span-1 text-[var(--text-secondary)] text-sm hidden md:block truncate">{job.location}</p>

                {/* Applicants */}
                <span className="col-span-1 font-bold text-sm text-[var(--text-primary)]">{job.applicants}</span>

                {/* Status badge */}
                <div className="col-span-1 hidden sm:block">
                  <Badge variant={isActive ? "success" : "neutral"} size="sm" dot>
                    {isActive ? "Active" : "Closed"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center gap-3 flex-wrap">
                  <Link href={adminJobApplicantsUrl(job.id)}
                    className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded">
                    Applicants
                  </Link>
                  <Link href={adminEditJobUrl(job.id)}
                    className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded">
                    Edit
                  </Link>
                  {isActive ? (
                    <button type="button"
                      onClick={() => setConfirmTarget({ id: job.id, action: "close", title: job.title })}
                      className="text-xs font-semibold text-[var(--color-warning)] hover:text-[var(--color-warning)] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded">
                      Close
                    </button>
                  ) : (
                    <button type="button"
                      onClick={() => setConfirmTarget({ id: job.id, action: "reopen", title: job.title })}
                      className="text-xs font-semibold text-[var(--color-success)] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded">
                      Reopen
                    </button>
                  )}
                  <button type="button"
                    onClick={() => setConfirmTarget({ id: job.id, action: "delete", title: job.title })}
                    className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-[var(--text-muted)] text-xs text-center">
          Showing {filtered.length} of {jobs.length} listing{jobs.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Confirmation modal ── */}
      {confirmTarget && meta && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true"
            onClick={() => { if (!actionLoading) { setConfirmTarget(null); setActionError(""); } }} />
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-sm"
            role="dialog" aria-modal="true" aria-labelledby="confirm-heading">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 id="confirm-heading" className="font-black text-[var(--text-primary)] text-lg">
                {meta.heading}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {meta.body(confirmTarget.title)}
              </p>

              {actionError && (
                <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
                  <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0" />
                  <p className="text-xs font-medium text-[var(--color-error)]">{actionError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" disabled={actionLoading}
                  onClick={() => { setConfirmTarget(null); setActionError(""); }}>
                  Cancel
                </Button>
                <Button
                  variant={meta.danger ? "danger" : "gradient"}
                  size="md" pill
                  loading={actionLoading}
                  onClick={confirmAction}>
                  {meta.confirm}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
