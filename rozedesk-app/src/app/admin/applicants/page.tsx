"use client";
/**
 * /admin/applicants — All applicants, fully wired to real API.
 *
 * GET  /api/admin/applicants?job=&q= — load + filter
 * PATCH /api/admin/applicants/[id]   — update status
 *
 * Status actions per current status:
 *   PENDING_PAYMENT      → no action (waiting for payment)
 *   PAYMENT_UNDER_REVIEW → Mark Under Review / Reject
 *   CV_UNDER_REVIEW      → Shortlist / Reject
 *   SHORTLISTED          → Hire / Reject
 *   REJECTED             → Re-open to CV Review
 *   HIRED                → (terminal — no action)
 *
 * Frontend SOP §6.1: loading / empty / error / populated states.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: authHeaders(), Icon, STATUS_BADGE, updateStatus — each defined once.
 */
import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Badge from "@/components/Badge";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
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
    "Content-Type": "application/json",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

interface Applicant {
  id: string; userId: string; applicantName: string; email: string; phone: string;
  jobId: string; jobTitle: string; company: string;
  cvUrl: string; status: string; appliedDate: string; location: string;
  payment: { id: string; method: string; receiptUrl: string; status: string; rejectionReason?: string | null } | null;
}

const STATUS_BADGE: Record<string, "brand"|"neutral"|"success"|"warning"|"error"> = {
  PENDING_PAYMENT:"brand", PAYMENT_UNDER_REVIEW:"warning", CV_UNDER_REVIEW:"warning",
  SHORTLISTED:"success", REJECTED:"error", HIRED:"success", PAYMENT_REJECTED:"error",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT:"Pending Payment", PAYMENT_UNDER_REVIEW:"Payment Review",
  CV_UNDER_REVIEW:"CV Review", SHORTLISTED:"Shortlisted",
  REJECTED:"Rejected", HIRED:"Hired", PAYMENT_REJECTED:"Payment Rejected",
};

/* Actions available per status — drives buttons shown in expanded row */
const STATUS_ACTIONS: Record<string, { label: string; next: string; color: string }[]> = {
  PAYMENT_UNDER_REVIEW: [
    { label:"Mark CV Under Review", next:"CV_UNDER_REVIEW", color:"neutral"  },
    { label:"Reject",               next:"REJECTED",        color:"error"    },
  ],
  CV_UNDER_REVIEW: [
    { label:"Shortlist",  next:"SHORTLISTED", color:"success" },
    { label:"Reject",     next:"REJECTED",    color:"error"   },
  ],
  SHORTLISTED: [
    { label:"Mark as Hired", next:"HIRED",    color:"success" },
    { label:"Reject",        next:"REJECTED", color:"error"   },
  ],
  REJECTED: [
    { label:"Re-open (CV Review)", next:"CV_UNDER_REVIEW", color:"neutral" },
  ],
};

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";
const FILTER_TABS = [
  { key:"All",                   label:"All"             },
  { key:"PENDING_PAYMENT",       label:"Pending Payment" },
  { key:"PAYMENT_UNDER_REVIEW",  label:"Payment Review"  },
  { key:"CV_UNDER_REVIEW",       label:"CV Review"       },
  { key:"SHORTLISTED",           label:"Shortlisted"     },
  { key:"REJECTED",              label:"Rejected"        },
  { key:"HIRED",                 label:"Hired"           },
];

function ApplicantsPageInner() {
  const searchParams = useSearchParams();

  const [applicants,   setApplicants]   = useState<Applicant[]>([]);
  const [jobs,         setJobs]         = useState<{ id: string; title: string }[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [jobFilter,    setJobFilter]    = useState(() => searchParams.get("job") ?? "all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [updating,     setUpdating]     = useState<Record<string, boolean>>({});

  const toast  = useToast();

  /* ── CV Modal state ── */
  const [cvModal,        setCvModal]        = useState<{ userId: string; name: string } | null>(null);
  const [cvData,         setCvData]         = useState<Record<string, unknown> | null>(null);
  const [cvLoading,      setCvLoading]      = useState(false);

  /* Sync ?job= URL param */
  useEffect(() => {
    const job = searchParams.get("job");
    if (job) setJobFilter(job);
  }, [searchParams]);

  /* Load job listings for the filter dropdown */
  useEffect(() => {
    fetch("/api/admin/jobs", { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((data: { id: string; title: string }[]) =>
        setJobs(data.map(j => ({ id: j.id, title: j.title })))
      )
      .catch(() => {});
  }, []);

  /* Load applicants */
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (jobFilter !== "all") params.set("job", jobFilter);
      const res = await fetch(`/api/admin/applicants?${params}`, {
        headers: authHeaders(), credentials: "include",
      });
      if (!res.ok) throw new Error((await res.json()).message ?? "Failed to load");
      setApplicants(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  }, [jobFilter]);

  useEffect(() => { load(); }, [load]);

  /* Update applicant status */
  const updateStatus = useCallback(async (id: string, status: string) => {
    setUpdating(p => ({ ...p, [id]: true }));
    setError("");
    try {
      const res = await fetch(`/api/admin/applicants/${id}`, {
        method: "PATCH", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      const LABELS: Record<string,string> = { SHORTLISTED:"Shortlisted ✓", HIRED:"Hired 🎉", REJECTED:"Marked as rejected", CV_UNDER_REVIEW:"Moved to CV review" };
      toast.success(LABELS[status] ?? `Status updated to ${status}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Status update failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(p => ({ ...p, [id]: false }));
    }
  }, []);
  /* Client-side filter + search on fetched data */
  const filtered = useMemo(() =>
    applicants.filter(a => {
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchSearch = search === "" ||
        a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [applicants, statusFilter, search]
  );

  /* Count per tab */
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: applicants.length };
    FILTER_TABS.slice(1).forEach(t => {
      c[t.key] = applicants.filter(a => a.status === t.key).length;
    });
    return c;
  }, [applicants]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Applicants</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading
              ? "Loading…"
              : `${counts.SHORTLISTED ?? 0} shortlisted · ${counts.HIRED ?? 0} hired · ${applicants.length} total`
            }
          </p>
        </div>
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
      <div className="flex flex-col gap-3">

        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-x-auto w-full"
          role="tablist" aria-label="Filter by status">
          {FILTER_TABS.map(tab => (
            <button key={tab.key} type="button" role="tab"
              aria-selected={statusFilter === tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap",
                "transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                statusFilter === tab.key
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}>
              {tab.label}
              <span className={[
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                statusFilter === tab.key ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]",
              ].join(" ")}>
                {counts[tab.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <label htmlFor="applicant-search" className="sr-only">Search applicants</label>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4" />
            </div>
            <input id="applicant-search" type="search" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or job title…"
              className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all" />
          </div>

          {/* Job filter */}
          <div>
            <label htmlFor="job-filter" className="sr-only">Filter by job listing</label>
            <select id="job-filter" value={jobFilter} onChange={e => setJobFilter(e.target.value)}
              className="h-9 px-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] appearance-none cursor-pointer min-w-[180px]">
              <option value="all">All Listings</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Applicant list */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-8 h-8 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">No applicants found</p>
          <p className="text-[var(--text-muted)] text-sm">
            {search || statusFilter !== "All"
              ? "Try adjusting your filters or search."
              : "No one has applied yet. Once seekers submit applications, they appear here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(app => {
            const isExpanded = expanded === app.id;
            const actions    = STATUS_ACTIONS[app.status] ?? [];

            return (
              <div key={app.id} className={`${CARD} overflow-hidden hover:border-[var(--border-hover)] transition-all`}>

                {/* Row header — click to expand */}
                <button type="button"
                  onClick={() => setExpanded(isExpanded ? null : app.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`applicant-${app.id}`}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--bg-surface)] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {app.applicantName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{app.applicantName}</p>
                    <p className="text-[var(--text-muted)] text-xs truncate">
                      {app.jobTitle}
                      {app.company ? ` · ${app.company}` : ""}
                    </p>
                  </div>
                  <span className="text-[var(--text-muted)] text-xs flex-shrink-0 hidden sm:inline">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </span>
                  <Badge variant={STATUS_BADGE[app.status] ?? "neutral"} size="sm" dot>
                    {STATUS_LABEL[app.status] ?? app.status}
                  </Badge>
                  <Icon path="M9 5l7 7-7 7"
                    className={`w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div id={`applicant-${app.id}`}
                    className="border-t border-[var(--border-default)] px-4 pb-4 pt-3 flex flex-col gap-4">

                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label:"Email",    value:app.email,    icon:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                        { label:"Phone",    value:app.phone,    icon:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                        { label:"Location", value:app.location, icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)]">
                          <Icon path={f.icon} className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{f.label}</p>
                            <p className="text-[var(--text-primary)] text-sm font-medium truncate">{f.value || "—"}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment info if available */}
                    {app.payment && (
                      <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-default)]">
                        <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Payment</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {app.payment.method} · <Badge variant={app.payment.status === "APPROVED" ? "success" : app.payment.status === "REJECTED" ? "error" : "warning"} size="sm">{app.payment.status}</Badge>
                          </p>
                        </div>
                        {app.payment.receiptUrl && (
                          <button type="button"
                            onClick={async () => {
                              if (app.payment!.receiptUrl.startsWith("/uploads/")) {
                                window.open(app.payment!.receiptUrl, "_blank");
                              } else {
                                const res = await fetch(`/api/admin/file?path=${encodeURIComponent(app.payment!.receiptUrl)}`, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem("rozedesk-token") ?? ""}` },
                                  credentials: "include",
                                });
                                if (res.ok) { const { url } = await res.json(); window.open(url, "_blank"); }
                              }
                            }}
                            className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 flex-shrink-0">
                            View Receipt →
                          </button>
                        )}
                      </div>
                    )}

                    {/* CV link — opens inline modal with full CV preview */}
                    {app.cvUrl && (
                      <button type="button"
                        onClick={async () => {
                          /* Extract userId from profile-cv path or fetch by applicant */
                          setCvModal({ userId: app.userId ?? app.id, name: app.applicantName });
                          setCvData(null);
                          setCvLoading(true);
                          try {
                            const uid = app.cvUrl.startsWith("/profile-cv/")
                              ? app.cvUrl.replace("/profile-cv/", "")
                              : app.userId;
                            const res = await fetch(`/api/admin/cv/${uid}`, {
                              headers: { Authorization: `Bearer ${localStorage.getItem("rozedesk-token") ?? ""}` },
                              credentials: "include",
                            });
                            if (res.ok) setCvData(await res.json());
                          } finally { setCvLoading(false); }
                        }}
                        className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 w-fit">
                        <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-4 h-4" />
                        View CV
                      </button>
                    )}

                    {/* Status action buttons — driven by STATUS_ACTIONS config */}
                    {actions.length > 0 && (
                      <div className="flex items-center gap-2.5 flex-wrap pt-1 border-t border-[var(--border-default)]">
                        {actions.map(action => (
                          <button key={action.next} type="button"
                            disabled={updating[app.id]}
                            onClick={() => updateStatus(app.id, action.next)}
                            className={[
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-colors disabled:opacity-50",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                              action.color === "success"
                                ? "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_25%,transparent)]"
                                : action.color === "error"
                                  ? "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)]"
                                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]",
                            ].join(" ")}>
                            {updating[app.id] ? "Updating…" : action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Terminal status message */}
                    {app.status === "HIRED" && (
                      <p className="text-xs font-semibold text-[var(--color-success)] flex items-center gap-1.5">
                        <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                        This applicant has been hired.
                      </p>
                    )}
                    {app.status === "PENDING_PAYMENT" && (
                      <p className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
                        <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                        Waiting for applicant to submit payment receipt.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[var(--text-muted)] text-xs text-center">
          Showing {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── CV Modal ── */}
      {cvModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true" onClick={() => setCvModal(null)} />

          <div className="fixed inset-4 sm:inset-6 z-50 flex flex-col rounded-[var(--radius-2xl)] bg-white dark:bg-[var(--bg-base)] border border-[var(--border-default)] shadow-[var(--shadow-3)] overflow-hidden"
            role="dialog" aria-modal="true" aria-label="Applicant CV">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex-shrink-0 print:hidden">
              <div>
                <p className="font-bold text-[var(--text-primary)] text-base">CV — {cvModal.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Generated from applicant profile</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button"
                  onClick={() => {
                    /* Open CV in a new window for clean printing */
                    const content = document.getElementById("cv-print-area")?.innerHTML;
                    if (!content) return;
                    const win = window.open("", "_blank", "width=800,height=900");
                    if (!win) return;
                    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>CV — ${cvModal.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #111; background: white; padding: 32px; max-width: 760px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 4px; }
    h2 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
    section { margin-bottom: 20px; }
    .contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #555; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #111; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .edu-item, .exp-item { margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
    .title { font-weight: 700; color: #111; }
    .subtitle { font-size: 11px; color: #666; margin-top: 1px; }
    .meta { font-size: 11px; color: #888; white-space: nowrap; }
    .desc { font-size: 12px; color: #444; margin-top: 4px; line-height: 1.6; }
    .prefs { display: flex; gap: 24px; font-size: 12px; color: #555; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #aaa; text-align: center; }
    @media print { body { padding: 0; } @page { margin: 1.5cm; } }
  </style>
</head>
<body>${content}</body>
</html>`);
                    win.document.close();
                    win.focus();
                    setTimeout(() => win.print(), 500);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[var(--brand-500)] text-white hover:bg-[var(--brand-600)] transition-colors">
                  <Icon path="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" className="w-3.5 h-3.5"/>
                  Print / Save PDF
                </button>
                <button type="button" onClick={() => setCvModal(null)}
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                  aria-label="Close CV">
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* CV content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white" id="cv-print-area">
              {cvLoading ? (
                <div style={{display:"flex",flexDirection:"column",gap:16,padding:32}}>
                  {[200,320,240,280].map((w,i)=><div key={i} style={{height:12,width:w,background:"#e5e7eb",borderRadius:4}}/>)}
                </div>
              ) : cvData ? (
                <div style={{maxWidth:680,margin:"0 auto",fontFamily:"system-ui,sans-serif",fontSize:13,color:"#111",lineHeight:1.6}}>

                  {/* Name + contact */}
                  <div style={{borderBottom:"2px solid #111",paddingBottom:16,marginBottom:20}}>
                    <h1 style={{fontSize:24,fontWeight:900,margin:"0 0 4px"}}>{cvData.name as string}</h1>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"4px 16px",fontSize:11,color:"#555"}} className="contact">
                      {(cvData.email    as string) && <span>✉ {cvData.email    as string}</span>}
                      {(cvData.phone    as string) && <span>📞 {cvData.phone    as string}</span>}
                      {(cvData.location as string) && <span>📍 {cvData.location as string}</span>}
                      {(cvData.linkedin as string) && <span>🔗 {cvData.linkedin as string}</span>}
                      {(cvData.github   as string) && <span>🐙 {cvData.github   as string}</span>}
                      {(cvData.portfolio as string)&& <span>🌐 {cvData.portfolio as string}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  {(cvData.summary as string) && (
                    <div style={{marginBottom:20}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Professional Summary</h2>
                      <p style={{color:"#333"}}>{cvData.summary as string}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {Array.isArray(cvData.skills) && (cvData.skills as string[]).length > 0 && (
                    <div style={{marginBottom:20}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Skills</h2>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}} className="skills">
                        {(cvData.skills as string[]).map((s:string)=>(
                          <span key={s} style={{background:"#f3f4f6",border:"1px solid #e5e7eb",padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:600}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {Array.isArray(cvData.education) && (cvData.education as unknown[]).length > 0 && (
                    <div style={{marginBottom:20}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Education</h2>
                      {(cvData.education as Record<string,string>[]).map((e,i)=>(
                        <div key={i} style={{marginBottom:12}} className="edu-item">
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <strong style={{fontSize:13}}>{e.institution}</strong>
                            <span style={{fontSize:11,color:"#888",flexShrink:0}}>{e.year}</span>
                          </div>
                          <div style={{fontSize:11,color:"#666"}}>{e.level}{e.board ? ` · ${e.board}` : ""}</div>
                          {(e.obtainedMarks||e.grade)&&<div style={{fontSize:11,color:"#888"}}>
                            {e.obtainedMarks&&e.totalMarks?`${e.obtainedMarks}/${e.totalMarks} marks`:""}{e.grade?` · Grade: ${e.grade}`:""}
                          </div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {Array.isArray(cvData.experience) && (cvData.experience as unknown[]).length > 0 && (
                    <div style={{marginBottom:20}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Work Experience</h2>
                      {(cvData.experience as Record<string,string|boolean>[]).map((e,i)=>(
                        <div key={i} style={{marginBottom:14}} className="exp-item">
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <strong style={{fontSize:13}}>{e.title as string}</strong>
                            <span style={{fontSize:11,color:"#888",flexShrink:0}}>
                              {e.startDate as string}{e.current?" – Present":e.endDate?` – ${e.endDate as string}`:""}
                            </span>
                          </div>
                          <div style={{fontSize:12,color:"#555",fontWeight:600}}>{e.company as string}</div>
                          {(e.description as string)&&<div style={{fontSize:12,color:"#444",marginTop:4}}>{e.description as string}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Current project */}
                  {(cvData.currentProject as string)&&(
                    <div style={{marginBottom:20}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Current Project</h2>
                      <p style={{color:"#333"}}>{cvData.currentProject as string}</p>
                    </div>
                  )}

                  {/* Preferences */}
                  {((cvData.jobType as string)||(cvData.desiredSalary as string))&&(
                    <div style={{marginBottom:8}} className="section">
                      <h2 style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#777",borderBottom:"1px solid #e5e7eb",paddingBottom:4,marginBottom:8}}>Preferences</h2>
                      <div style={{display:"flex",gap:24,fontSize:12,color:"#555"}}>
                        {(cvData.jobType as string)&&<span><strong>Job Type:</strong> {cvData.jobType as string}</span>}
                        {(cvData.desiredSalary as string)&&<span><strong>Expected:</strong> PKR {cvData.desiredSalary as string}/month</span>}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="footer" style={{marginTop:32,paddingTop:12,borderTop:"1px solid #e5e7eb",fontSize:10,color:"#aaa",textAlign:"center"}}>
                    Generated by RozeDesk · {new Date().toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:64,textAlign:"center"}}>
                  <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-10 h-10 text-[var(--text-muted)]"/>
                  <p className="font-semibold text-[var(--text-primary)]">No CV data found</p>
                  <p className="text-sm text-[var(--text-muted)]">The applicant may not have completed their profile.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return <Suspense><ApplicantsPageInner /></Suspense>;
}

export const dynamic = "force-dynamic";
