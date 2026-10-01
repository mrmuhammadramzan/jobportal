"use client";
/**
 * /admin/game-deposits — Review game wallet deposit screenshots.
 *
 * GET  /api/admin/game-deposits?status=PENDING&page=1
 * PATCH /api/admin/game-deposits  { depositId, action:"APPROVE"|"REJECT", reason? }
 *
 * Patterns match /admin/payments exactly:
 *   - authHeaders(), CARD, Icon — same shape (DRY across admin pages)
 *   - Filter tabs, search bar, status badges — identical structure
 *   - Screenshot preview modal — reuses same image render logic
 *   - Rejection modal — requires reason before submit
 *
 * Frontend SOP §6.1: loading / empty / error / success all handled.
 * Backend SOP §6.2: action hits PATCH which re-checks ownership server-side.
 * UI/UX SOP Hard Rule 3: all colours via CSS var tokens.
 * UI/UX SOP Hard Rule 5: destructive reject requires reason.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Badge        from "@/components/Badge";
import Button       from "@/components/Button";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useToast } from "@/components/Toast";

/* ── Icon primitive (same shape as every other admin page) ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

function authHeaders(): HeadersInit {
  const tok = typeof window !== "undefined"
    ? localStorage.getItem("rozedesk-token") ?? "" : "";
  return {
    "Content-Type": "application/json",
    Authorization:  `Bearer ${tok}`,
  };
}

/* ── Data types ── */
type DepStatus = "PENDING" | "APPROVED" | "REJECTED";
type FilterTab = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

interface Deposit {
  id:              string;
  userId:          string;
  userName:        string;
  userEmail:       string;
  amount:          number;
  method:          string;
  screenshotUrl:   string;
  status:          DepStatus;
  rejectionReason: string | null;
  submittedAt:     string;
  reviewedAt:      string | null;
}

/* ── Status badge map ── */
const STATUS_BADGE: Record<DepStatus, { variant: "warning"|"success"|"error"; label: string }> = {
  PENDING:  { variant: "warning", label: "Pending"  },
  APPROVED: { variant: "success", label: "Approved" },
  REJECTED: { variant: "error",   label: "Rejected" },
};

/* ── Method colour pill (same method colours as payments page) ── */
const METHOD_CLR: Record<string, string> = {
  JAZZCASH:  "bg-[#cc2229] text-white",
  EASYPAISA: "bg-[#3d7f41] text-white",
};
const METHOD_LBL: Record<string, string> = {
  JAZZCASH: "JazzCash", EASYPAISA: "Easypaisa",
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "PENDING",  label: "Pending"  },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ALL",      label: "All"      },
];

/* ══════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════ */
export default function AdminGameDepositsPage() {
  const toast = useToast();

  /* ── Data state ── */
  const [deposits,      setDeposits]      = useState<Deposit[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);

  /* ── UI state ── */
  const [filter,        setFilter]        = useState<FilterTab>("PENDING");
  const [search,        setSearch]        = useState("");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  /* ── Reject modal ── */
  const [rejectId,     setRejectId]     = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectErr,    setRejectErr]    = useState("");

  /* ── Screenshot modal ── */
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  /* ── Fetch deposits ── */
  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(
        `/api/admin/game-deposits?status=${filter}&page=${page}`,
        { credentials: "include", headers: authHeaders() },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to load deposits.");
      setDeposits(data.deposits ?? []);
      setTotalPages(data.pages ?? 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load deposits.");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchDeposits(); }, [fetchDeposits]);

  /* Reset page when filter changes */
  useEffect(() => { setPage(1); }, [filter]);

  /* ── Client-side search (deposits already filtered by status server-side) ── */
  const displayed = useMemo(() =>
    deposits.filter(d => {
      if (!search) return true;
      const q = search.toLowerCase();
      return d.userName.toLowerCase().includes(q)
          || d.userEmail.toLowerCase().includes(q)
          || d.method.toLowerCase().includes(q);
    }),
    [deposits, search],
  );

  /* ── KPI counts (from current loaded page — summary only) ── */
  const counts = useMemo(() => ({
    PENDING:  deposits.filter(d => d.status === "PENDING").length,
    APPROVED: deposits.filter(d => d.status === "APPROVED").length,
    REJECTED: deposits.filter(d => d.status === "REJECTED").length,
    ALL:      deposits.length,
  }), [deposits]);

  /* ── Approve action ── */
  const approve = useCallback(async (id: string) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try {
      const res  = await fetch("/api/admin/game-deposits", {
        method:      "PATCH",
        credentials: "include",
        headers:     authHeaders(),
        body:        JSON.stringify({ depositId: id, action: "APPROVE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Approval failed.");
      setDeposits(prev =>
        prev.map(d => d.id === id ? { ...d, status: "APPROVED" } : d),
      );
      toast.success("Deposit approved — balance credited to user.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Approval failed.");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  }, [toast]);

  /* ── Reject action (requires reason) ── */
  const openReject = useCallback((id: string) => {
    setRejectId(id);
    setRejectReason("");
    setRejectErr("");
  }, []);

  const confirmReject = useCallback(async () => {
    if (!rejectId) return;
    if (!rejectReason.trim()) {
      setRejectErr("Please enter a rejection reason.");
      return;
    }
    setActionLoading(p => ({ ...p, [rejectId]: true }));
    try {
      const res  = await fetch("/api/admin/game-deposits", {
        method:      "PATCH",
        credentials: "include",
        headers:     authHeaders(),
        body:        JSON.stringify({ depositId: rejectId, action: "REJECT", reason: rejectReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Rejection failed.");
      setDeposits(prev =>
        prev.map(d => d.id === rejectId
          ? { ...d, status: "REJECTED", rejectionReason: rejectReason.trim() } : d),
      );
      toast.info("Deposit rejected. User has been notified.");
      setRejectId(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Rejection failed.");
    } finally {
      if (rejectId) setActionLoading(p => ({ ...p, [rejectId]: false }));
    }
  }, [rejectId, rejectReason, toast]);

  /* ════════════════════════════════════════
     Render
     ════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Game Deposits
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading
              ? "Loading…"
              : `${counts.PENDING} pending · ${counts.APPROVED} approved · ${counts.REJECTED} rejected`}
          </p>
        </div>
        <Button variant="outline" size="sm" pill
          icon={<Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4"/>}
          onClick={fetchDeposits}>
          Refresh
        </Button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)]"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => setError("")}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            Dismiss
          </button>
        </div>
      )}

      {/* ── KPI row ── */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending",  value: counts.PENDING,  color: "var(--color-warning)" },
            { label: "Approved", value: counts.APPROVED, color: "var(--color-success)" },
            { label: "Rejected", value: counts.REJECTED, color: "var(--color-error)"   },
          ].map(s => (
            <div key={s.label} className={`${CARD} flex flex-col gap-2 p-4`}>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Controls: filter tabs + search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] flex-shrink-0"
          role="group" aria-label="Filter by status">
          {FILTER_TABS.map(tab => (
            <button key={tab.key} type="button" aria-pressed={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap",
                "transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                filter === tab.key
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}>
              {tab.label}
              <span className={[
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-[var(--bg-surface)] text-[var(--text-muted)]",
              ].join(" ")}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-0">
          <label htmlFor="dep-search" className="sr-only">Search deposits</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
          </div>
          <input id="dep-search" type="search" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or method…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"/>
        </div>
      </div>

      {/* ── Deposit list ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} showIcon/>)}
        </div>
      ) : displayed.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-3 py-12 text-center`}>
          <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            className="w-8 h-8 text-[var(--text-muted)]"/>
          <p className="font-semibold text-[var(--text-primary)]">No deposits found</p>
          <p className="text-[var(--text-muted)] text-sm">
            {filter === "PENDING" ? "No deposits waiting for review." : "Try adjusting the filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map(d => {
            const bs = STATUS_BADGE[d.status];
            return (
              <div key={d.id} className={`${CARD} overflow-hidden`}>
                <div className="flex items-start gap-4 p-4">

                  {/* User avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none">
                    {d.userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Top row: name + badge */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{d.userName}</p>
                        <p className="text-[var(--text-muted)] text-xs">{d.userEmail}</p>
                      </div>
                      <Badge variant={bs.variant} size="sm" dot>{bs.label}</Badge>
                    </div>

                    {/* Amount + method row */}
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="text-sm font-black text-[var(--text-primary)]">Rs. {d.amount}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${METHOD_CLR[d.method] ?? "bg-[var(--bg-surface)] text-[var(--text-muted)]"}`}>
                        {METHOD_LBL[d.method] ?? d.method}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Submitted: {new Date(d.submittedAt).toLocaleString("en-PK")}
                      {d.reviewedAt && ` · Reviewed: ${new Date(d.reviewedAt).toLocaleString("en-PK")}`}
                    </p>

                    {/* View screenshot */}
                    {d.screenshotUrl && (
                      <button type="button"
                        onClick={() => setScreenshotUrl(d.screenshotUrl)}
                        className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 w-fit mt-0.5">
                        View Screenshot →
                      </button>
                    )}

                    {/* Rejection reason */}
                    {d.status === "REJECTED" && d.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
                        <p className="text-xs font-semibold text-[var(--color-error)]">Rejection reason</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{d.rejectionReason}</p>
                      </div>
                    )}

                    {/* Actions — pending only */}
                    {d.status === "PENDING" && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button type="button"
                          disabled={actionLoading[d.id]}
                          onClick={() => approve(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_25%,transparent)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]">
                          <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5"/>
                          {actionLoading[d.id] ? "Approving…" : "Approve & Credit Balance"}
                        </button>
                        <button type="button"
                          disabled={actionLoading[d.id]}
                          onClick={() => openReject(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]">
                          <Icon path="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5"/>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" pill
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            icon={<Icon path="M15 19l-7-7 7-7" className="w-4 h-4"/>}>
            Previous
          </Button>
          <span className="text-sm text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" pill
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>
            Next
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════
          Screenshot preview modal
          ══════════════════════════════════ */}
      {screenshotUrl && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setScreenshotUrl(null)}/>

          <div
            className="fixed inset-4 sm:inset-8 z-50 flex flex-col rounded-[var(--radius-2xl)] bg-[var(--bg-base)] border border-[var(--border-default)] shadow-[var(--shadow-3)] overflow-hidden"
            role="dialog" aria-modal="true" aria-label="Payment screenshot">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex-shrink-0">
              <p className="font-bold text-[var(--text-primary)] text-base">Payment Screenshot</p>
              <div className="flex items-center gap-2">
                <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
                  <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-3.5 h-3.5"/>
                  Open full size
                </a>
                <button type="button" onClick={() => setScreenshotUrl(null)}
                  aria-label="Close screenshot"
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Screenshot image */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[var(--bg-surface)] p-4">
              {screenshotUrl.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|webp)/i.test(screenshotUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={screenshotUrl} alt="Payment screenshot"
                  className="max-w-full max-h-[70vh] rounded-[var(--radius-lg)] shadow-[var(--shadow-2)] object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    className="w-10 h-10 text-[var(--text-muted)]"/>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Cannot preview this file</p>
                  <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--brand-500)] hover:underline">
                    Open file directly →
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════
          Rejection reason modal
          ══════════════════════════════════ */}
      {rejectId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setRejectId(null)}/>
          <div
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-md"
            role="dialog" aria-modal="true" aria-label="Reject deposit">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 className="font-black text-[var(--text-primary)] text-lg">Reject Deposit</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Tell the user why their deposit was rejected. This will appear on their game page.
              </p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rej-reason"
                  className="text-sm font-medium text-[var(--text-primary)]">
                  Reason
                  <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
                </label>
                <textarea id="rej-reason" rows={3} value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectErr(""); }}
                  placeholder="e.g. Screenshot is unclear — transaction ID not visible."
                  className={[
                    "w-full px-3 py-2 rounded-[var(--radius-md)] border text-sm resize-none",
                    "bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "outline-none transition-all focus:ring-2",
                    rejectErr
                      ? "border-[var(--color-error)] focus:ring-[var(--color-error)]/20"
                      : "border-[var(--border-default)] focus:border-[var(--brand-500)] focus:ring-[var(--brand-500)]/20",
                  ].join(" ")}/>
                {rejectErr && (
                  <p role="alert" className="text-xs text-[var(--color-error)] font-medium">
                    {rejectErr}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setRejectId(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="md" pill
                  loading={rejectId ? actionLoading[rejectId] : false}
                  onClick={confirmReject}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
