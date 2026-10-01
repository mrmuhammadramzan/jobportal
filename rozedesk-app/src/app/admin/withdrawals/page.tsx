"use client";
/**
 * /admin/withdrawals — Review player withdrawal requests.
 *
 * GET  /api/admin/game-withdrawals?status=PENDING&page=1
 * PATCH /api/admin/game-withdrawals  { withdrawalId, action, reason }
 *
 * Patterns mirror /admin/game-deposits exactly (DRY across admin pages):
 *   - authHeaders, CARD, Icon, filter tabs, reject modal — identical shape.
 *   - Approve: deducts player balance atomically (server-side).
 *   - Reject: requires reason, player notified.
 *
 * Frontend SOP §6.1: loading / empty / error / success all handled.
 * Backend SOP §6.2: action re-validates server-side — client is untrusted.
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import Badge        from "@/components/Badge";
import Button       from "@/components/Button";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useToast } from "@/components/Toast";
import { ROUTES }   from "@/lib/routes";
import { safeFetch, ApiError } from "@/lib/api";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function authHeaders(): HeadersInit {
  const tok = typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${tok}` };
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";
type Status  = "PENDING" | "APPROVED" | "REJECTED";
type Filter  = Status | "ALL";

interface Withdrawal {
  id: string; userId: string; userName: string; userEmail: string;
  amount: number; method: string; accountNumber: string; accountName: string;
  status: Status; rejectionReason: string | null; submittedAt: string; reviewedAt: string | null;
}

const STATUS_BADGE: Record<Status, { variant: "warning" | "success" | "error"; label: string }> = {
  PENDING:  { variant: "warning", label: "Pending"  },
  APPROVED: { variant: "success", label: "Approved" },
  REJECTED: { variant: "error",   label: "Rejected" },
};

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "PENDING",  label: "Pending"  },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ALL",      label: "All"      },
];

export default function AdminWithdrawalsPage() {
  const toast = useToast();

  const [withdrawals,    setWithdrawals]    = useState<Withdrawal[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [filter,         setFilter]         = useState<Filter>("PENDING");
  const [page,           setPage]           = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [search,         setSearch]         = useState("");
  const [actionLoading,  setActionLoading]  = useState<Record<string, boolean>>({});
  const [rejectId,       setRejectId]       = useState<string | null>(null);
  const [rejectReason,   setRejectReason]   = useState("");
  const [rejectErr,      setRejectErr]      = useState("");
  const rejectRef = useRef<HTMLTextAreaElement>(null);

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await safeFetch<{ withdrawals: Withdrawal[]; pages: number }>(
        `/api/admin/game-withdrawals?status=${filter}&page=${page}`,
        { credentials: "include", headers: authHeaders() },
      );
      setWithdrawals(data.withdrawals ?? []);
      setTotalPages(data.pages ?? 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load withdrawals.");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [filter]);

  /* ── Client search ── */
  const displayed = withdrawals.filter(w => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.userName.toLowerCase().includes(q)
        || w.userEmail.toLowerCase().includes(q)
        || w.accountNumber.includes(q);
  });

  const counts = {
    PENDING:  withdrawals.filter(w => w.status === "PENDING").length,
    APPROVED: withdrawals.filter(w => w.status === "APPROVED").length,
    REJECTED: withdrawals.filter(w => w.status === "REJECTED").length,
    ALL:      withdrawals.length,
  };

  /* ── Approve ── */
  const approve = useCallback(async (id: string) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try {
      await safeFetch("/api/admin/game-withdrawals", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ withdrawalId: id, action: "APPROVE" }),
      });
      setWithdrawals(p => p.map(w => w.id === id ? { ...w, status: "APPROVED" } : w));
      toast.success("Withdrawal approved — balance deducted.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Approval failed.");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  }, [toast]);

  /* ── Reject ── */
  const openReject = (id: string) => {
    setRejectId(id); setRejectReason(""); setRejectErr("");
    setTimeout(() => rejectRef.current?.focus(), 80);
  };

  const confirmReject = useCallback(async () => {
    if (!rejectId) return;
    if (!rejectReason.trim()) { setRejectErr("Reason is required."); return; }
    setActionLoading(p => ({ ...p, [rejectId]: true }));
    try {
      await safeFetch("/api/admin/game-withdrawals", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ withdrawalId: rejectId, action: "REJECT", reason: rejectReason.trim() }),
      });
      setWithdrawals(p => p.map(w => w.id === rejectId
        ? { ...w, status: "REJECTED", rejectionReason: rejectReason.trim() } : w));
      toast.info("Withdrawal rejected. Player notified.");
      setRejectId(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Rejection failed.");
    } finally {
      if (rejectId) setActionLoading(p => ({ ...p, [rejectId]: false }));
    }
  }, [rejectId, rejectReason, toast]);

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Withdrawal Requests
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${counts.PENDING} pending · ${counts.APPROVED} approved · ${counts.REJECTED} rejected`}
          </p>
        </div>
        <Button variant="outline" size="sm" pill onClick={fetchData}
          icon={<Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4"/>}>
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => setError("")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Dismiss</button>
        </div>
      )}

      {/* KPI row */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending",  value: counts.PENDING,  color: "var(--color-warning)" },
            { label: "Approved", value: counts.APPROVED, color: "var(--color-success)" },
            { label: "Rejected", value: counts.REJECTED, color: "var(--color-error)"   },
          ].map(s => (
            <div key={s.label} className={`${CARD} flex flex-col gap-2 p-4`}>
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] flex-shrink-0" role="group">
          {FILTER_TABS.map(t => (
            <button key={t.key} type="button" aria-pressed={filter === t.key} onClick={() => setFilter(t.key)}
              className={["flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap transition-all",
                filter === t.key
                  ? "bg-[var(--brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}>
              {t.label}
              <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                filter === t.key ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]",
              ].join(" ")}>{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <label htmlFor="wd-search" className="sr-only">Search withdrawals</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
          </div>
          <input id="wd-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or account…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-400)] focus:ring-2 focus:ring-[var(--brand-400)]/20 transition-all"/>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3].map(i => <SkeletonCard key={i} lines={3} showIcon/>)}</div>
      ) : displayed.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-3 py-12 text-center`}>
          <Icon path="M12 4v16m-4-4l4 4 4-4" className="w-8 h-8 text-[var(--text-muted)]"/>
          <p className="font-semibold text-[var(--text-primary)]">No withdrawals found</p>
          <p className="text-[var(--text-muted)] text-sm">
            {filter === "PENDING" ? "No pending withdrawal requests." : "Try adjusting the filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map(w => {
            const bs = STATUS_BADGE[w.status];
            return (
              <div key={w.id} className={`${CARD} overflow-hidden`}>
                <div className="flex items-start gap-4 p-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-400)] to-[var(--accent-400)] flex items-center justify-center text-[var(--text-inverse)] font-bold text-sm flex-shrink-0 select-none">
                    {w.userName.split(" ").map(c => c[0]).join("").slice(0,2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{w.userName}</p>
                        <p className="text-[var(--text-muted)] text-xs">{w.userEmail}</p>
                      </div>
                      <Badge variant={bs.variant} size="sm" dot>{bs.label}</Badge>
                    </div>

                    {/* Amount + method */}
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="text-sm font-black text-[var(--text-primary)]">Rs. {w.amount}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.method === "JAZZCASH" ? "bg-[#cc2229] text-white" : "bg-[#3d7f41] text-white"}`}>
                        {w.method === "JAZZCASH" ? "JazzCash" : "Easypaisa"}
                      </span>
                    </div>

                    {/* Account details */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0"/>
                      <span className="text-xs text-[var(--text-secondary)]">{w.accountName} · {w.accountNumber}</span>
                    </div>

                    <p className="text-[10px] text-[var(--text-muted)]">
                      Submitted: {new Date(w.submittedAt).toLocaleString("en-PK")}
                      {w.reviewedAt && ` · Reviewed: ${new Date(w.reviewedAt).toLocaleString("en-PK")}`}
                    </p>

                    {/* Rejection reason */}
                    {w.status === "REJECTED" && w.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
                        <p className="text-xs font-semibold text-[var(--color-error)]">Rejection reason</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{w.rejectionReason}</p>
                      </div>
                    )}

                    {/* Actions — pending only */}
                    {w.status === "PENDING" && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button type="button" disabled={actionLoading[w.id]} onClick={() => approve(w.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_22%,transparent)] transition-colors disabled:opacity-40">
                          <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5"/>
                          {actionLoading[w.id] ? "Processing…" : "Approve & Pay"}
                        </button>
                        <button type="button" disabled={actionLoading[w.id]} onClick={() => openReject(w.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_18%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_16%,transparent)] transition-colors disabled:opacity-40">
                          <Icon path="M6 18L18 6M6 6l12 12" className="w-3.5 h-3.5"/>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" pill disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            icon={<Icon path="M15 19l-7-7 7-7" className="w-4 h-4"/>}>Previous</Button>
          <span className="text-sm text-[var(--text-muted)]">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" pill disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>Next</Button>
        </div>
      )}

      {/* ── Reject modal ── */}
      {rejectId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setRejectId(null)}/>
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-md"
            role="dialog" aria-modal="true" aria-label="Reject withdrawal">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 className="font-black text-[var(--text-primary)] text-lg">Reject Withdrawal</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                The player will see this reason in their history. Their balance is NOT affected.
              </p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rej-reason" className="text-sm font-medium text-[var(--text-primary)]">
                  Reason<span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
                </label>
                <textarea ref={rejectRef} id="rej-reason" rows={3} value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectErr(""); }}
                  placeholder="e.g. Account number not valid."
                  className={["w-full px-3 py-2 rounded-[var(--radius-md)] border text-sm resize-none bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:ring-2",
                    rejectErr ? "border-[var(--color-error)] focus:ring-[var(--color-error)]/20" : "border-[var(--border-default)] focus:border-[var(--brand-400)] focus:ring-[var(--brand-400)]/20",
                  ].join(" ")}/>
                {rejectErr && <p role="alert" className="text-xs text-[var(--color-error)] font-medium">{rejectErr}</p>}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setRejectId(null)}>Cancel</Button>
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
