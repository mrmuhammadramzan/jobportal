"use client";
/**
 * /admin/payments — Review payment receipts, fully wired to real API.
 * GET   /api/admin/payments          — load on mount
 * PATCH /api/admin/payments/[id]     — approve or reject
 *
 * Frontend SOP §6.1: loading / empty / populated / error states.
 * UI/UX SOP §Hard Rule 5: rejection requires a reason before confirming.
 * DRY: authHeaders(), Icon, CARD, STATUS_BADGE — each defined once.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Badge  from "@/components/Badge";
import Button from "@/components/Button";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useFee } from "@/hooks/useFee";
import { useToast } from "@/components/Toast";

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
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

type PayStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

interface Receipt {
  id:               string;
  applicantName:    string;
  applicantEmail:   string;
  jobTitle:         string;
  jobId:            string;
  method:           string;
  amount:           number;
  receiptUrl:       string;
  receiptRef:       string | null;
  status:           PayStatus;
  rejectionReason?: string | null;
  submittedAt:      string;
  reviewedAt:       string | null;
}

type FilterTab = "all" | PayStatus;

const STATUS_BADGE: Record<PayStatus, { variant: "warning"|"success"|"error"|"neutral"; label: string }> = {
  PENDING:  { variant:"warning", label:"Pending Review" },
  APPROVED: { variant:"success", label:"Approved"       },
  REJECTED: { variant:"error",   label:"Rejected"       },
  REFUNDED: { variant:"neutral", label:"Refunded"       },
};

const METHOD_COLOR: Record<string, string> = {
  JAZZCASH: "bg-[#cc2229] text-white", EASYPAISA: "bg-[#3d7f41] text-white",
};
const METHOD_LABEL: Record<string, string> = {
  JAZZCASH: "JazzCash", EASYPAISA: "Easypaisa",
};

export default function AdminPaymentsPage() {
  const appFee = useFee();
  const toast  = useToast();

  const [receipts,     setReceipts]     = useState<Receipt[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [filter,       setFilter]       = useState<FilterTab>("PENDING");
  const [search,       setSearch]       = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError,  setRejectError]  = useState("");
  const [actionLoading,setActionLoading]= useState<Record<string, boolean>>({});
  /* Receipt modal */
  const [receiptModal, setReceiptModal] = useState<{ url: string; ref: string | null } | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  /* Load receipts */
  useEffect(() => {
    fetch("/api/admin/payments", { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load payments")))
      .then(setReceipts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    all:      receipts.length,
    PENDING:  receipts.filter(r => r.status === "PENDING").length,
    APPROVED: receipts.filter(r => r.status === "APPROVED").length,
    REJECTED: receipts.filter(r => r.status === "REJECTED").length,
    REFUNDED: receipts.filter(r => r.status === "REFUNDED").length,
  }), [receipts]);

  const displayed = useMemo(() =>
    receipts.filter(r => {
      const matchFilter = filter === "all" || r.status === filter;
      const matchSearch = search === "" ||
        r.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        r.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        (r.receiptRef ?? "").toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    }),
    [receipts, filter, search]
  );

  /* Approve */
  const approve = useCallback(async (id: string) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PATCH", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({ status: "APPROVED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: "APPROVED" } : r));
      toast.success("Payment approved — CV is now under review.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Approve failed.");
      setError(e instanceof Error ? e.message : "Approve failed.");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  }, []);

  /* Reject (requires reason) */
  const confirmReject = useCallback(async () => {
    if (!rejectReason.trim()) { setRejectError("Please enter a reason for rejection."); return; }
    if (!rejectTarget) return;
    setActionLoading(p => ({ ...p, [rejectTarget]: true }));
    try {
      const res = await fetch(`/api/admin/payments/${rejectTarget}`, {
        method: "PATCH", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({ status: "REJECTED", reason: rejectReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReceipts(prev => prev.map(r => r.id === rejectTarget
        ? { ...r, status: "REJECTED", rejectionReason: rejectReason.trim() } : r));
      setRejectTarget(null);
      setRejectReason("");
      toast.info("Payment rejected. Applicant has been notified.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Reject failed.");
      setError(e instanceof Error ? e.message : "Reject failed.");
    } finally {
      if (rejectTarget) setActionLoading(p => ({ ...p, [rejectTarget]: false }));
    }
  }, [rejectTarget, rejectReason]);

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key:"PENDING",  label:"Pending"  },
    { key:"APPROVED", label:"Approved" },
    { key:"REJECTED", label:"Rejected" },
    { key:"all",      label:"All"      },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Payment Receipts</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${counts.PENDING} pending · ${counts.APPROVED} approved · ${counts.REJECTED} rejected`}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)]" />
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => setError("")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Dismiss</button>
        </div>
      )}

      {/* KPI row */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:"Pending",  value:counts.PENDING,  color:"var(--color-warning)" },
            { label:"Approved", value:counts.APPROVED, color:"var(--color-success)" },
            { label:"Rejected", value:counts.REJECTED, color:"var(--color-error)"   },
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
          {FILTER_TABS.map(tab => (
            <button key={tab.key} type="button" aria-pressed={filter === tab.key} onClick={() => setFilter(tab.key)}
              className={["flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                filter===tab.key?"bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"].join(" ")}>
              {tab.label}
              <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full",filter===tab.key?"bg-white/20 text-white":"bg-[var(--bg-surface)] text-[var(--text-muted)]"].join(" ")}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <label htmlFor="pay-search" className="sr-only">Search payments</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4" />
          </div>
          <input id="pay-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by applicant, job, or ref…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all" />
        </div>
      </div>

      {/* Receipt list */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3].map(i=><SkeletonCard key={i} lines={3} showIcon/>)}</div>
      ) : displayed.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-3 py-12 text-center`}>
          <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-8 h-8 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">No receipts found</p>
          <p className="text-[var(--text-muted)] text-sm">{filter==="PENDING" ? "No receipts waiting for review." : "Try adjusting your filter."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map(r => {
            const bs = STATUS_BADGE[r.status];
            return (
              <div key={r.id} className={`${CARD} overflow-hidden`}>
                <div className="flex items-start gap-4 p-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.applicantName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{r.applicantName}</p>
                        <p className="text-[var(--text-muted)] text-xs">{r.applicantEmail}</p>
                      </div>
                      <Badge variant={bs.variant} size="sm" dot>{bs.label}</Badge>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="text-xs text-[var(--text-secondary)]">{r.jobTitle}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${METHOD_COLOR[r.method] ?? "bg-[var(--bg-surface)] text-[var(--text-muted)]"}`}>
                        {METHOD_LABEL[r.method] ?? r.method}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">PKR {r.amount}</span>
                      {r.receiptRef && <span className="text-[10px] font-mono text-[var(--text-muted)]">Ref: {r.receiptRef}</span>}
                    </div>

                    <p className="text-[10px] text-[var(--text-muted)]">Submitted: {new Date(r.submittedAt).toLocaleString()}</p>

                    {/* View Receipt — opens inline modal with image preview */}
                    {r.receiptUrl && (
                      <button type="button"
                        onClick={async () => {
                          setReceiptLoading(true);
                          try {
                            let url = r.receiptUrl;
                            /* data: URLs are already usable — open directly */
                            if (!url.startsWith("data:") && !url.startsWith("/uploads/")) {
                              const res = await fetch(`/api/admin/file?path=${encodeURIComponent(r.receiptUrl)}`, {
                                headers: { Authorization: `Bearer ${localStorage.getItem("rozedesk-token") ?? ""}` },
                                credentials: "include",
                              });
                              if (res.ok) { const d = await res.json(); url = d.url; }
                            }
                            setReceiptModal({ url, ref: r.receiptRef });
                          } finally {
                            setReceiptLoading(false);
                          }
                        }}
                        disabled={receiptLoading}
                        className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 w-fit disabled:opacity-50">
                        View Receipt →
                      </button>
                    )}

                    {/* Rejection reason */}
                    {r.status === "REJECTED" && r.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
                        <p className="text-xs font-semibold text-[var(--color-error)]">Rejection reason</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{r.rejectionReason}</p>
                      </div>
                    )}

                    {/* Actions — pending only */}
                    {r.status === "PENDING" && (
                      <div className="flex items-center gap-2 mt-2">
                        <button type="button" disabled={actionLoading[r.id]} onClick={() => approve(r.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_25%,transparent)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]">
                          <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
                          {actionLoading[r.id] ? "Approving…" : "Approve — CV Under Review"}
                        </button>
                        <button type="button" disabled={actionLoading[r.id]} onClick={() => { setRejectTarget(r.id); setRejectReason(""); setRejectError(""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]">
                          <Icon path="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button type="button" disabled={actionLoading[r.id]}
                          onClick={async () => {
                            if (!confirm("Reset this application so the applicant can resubmit their receipt?")) return;
                            setActionLoading(p => ({ ...p, [r.id]: true }));
                            try {
                              await fetch(`/api/admin/payments/${r.id}/reset`, {
                                method: "POST",
                                headers: { Authorization: `Bearer ${localStorage.getItem("rozedesk-token") ?? ""}` },
                                credentials: "include",
                              });
                              setReceipts(prev => prev.filter(x => x.id !== r.id));
                            } finally {
                              setActionLoading(p => ({ ...p, [r.id]: false }));
                            }
                          }}
                          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-warning)] transition-colors disabled:opacity-50">
                          Reset
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

      {/* Receipt preview modal */}
      {receiptModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setReceiptModal(null)} />
          <div className="fixed inset-4 sm:inset-8 z-50 flex flex-col rounded-[var(--radius-2xl)] bg-[var(--bg-base)] border border-[var(--border-default)] shadow-[var(--shadow-3)] overflow-hidden"
            role="dialog" aria-modal="true" aria-label="Payment receipt">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex-shrink-0">
              <div>
                <p className="font-bold text-[var(--text-primary)] text-base">Payment Receipt</p>
                {receiptModal.ref && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Ref: {receiptModal.ref}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a href={receiptModal.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
                  <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-3.5 h-3.5"/>
                  Open full size
                </a>
                <button type="button"
                  onClick={() => setReceiptModal(null)}
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                  aria-label="Close receipt">
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Receipt image / PDF */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[var(--bg-surface)] p-4">
              {(() => {
                const url = receiptModal.url;
                /* Determine file type — data: URLs carry mime type, paths have extension */
                const isPdf = url.startsWith("data:application/pdf") || url.toLowerCase().includes(".pdf");
                const isImage = url.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                /* Stale /uploads/ path — file no longer exists on server */
                const isStale = url.startsWith("/uploads/");

                if (isStale) {
                  return (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                      <Icon path="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-10 h-10 text-[var(--color-warning)]"/>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Receipt no longer available</p>
                      <p className="text-xs text-[var(--text-muted)] max-w-xs">
                        This file was stored on the server and was lost during a redeploy.
                        Ask the applicant to resubmit their receipt.
                      </p>
                    </div>
                  );
                }

                if (isPdf) {
                  /* Use <object> instead of <iframe> — bypasses X-Frame-Options DENY header */
                  return (
                    <object
                      data={url}
                      type="application/pdf"
                      className="w-full h-full min-h-[400px] rounded-[var(--radius-lg)]"
                      aria-label="Payment receipt PDF">
                      <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">PDF cannot be previewed here</p>
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-semibold text-[var(--brand-500)] hover:underline">
                          Open PDF in new tab →
                        </a>
                      </div>
                    </object>
                  );
                }

                if (isImage) {
                  return (
                    <img
                      src={url}
                      alt="Payment receipt"
                      className="max-w-full max-h-[70vh] rounded-[var(--radius-lg)] shadow-[var(--shadow-2)] object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  );
                }

                /* Unknown type — show open link */
                return (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-10 h-10 text-[var(--text-muted)]"/>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Cannot preview this file type</p>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-[var(--brand-500)] hover:underline">
                      Open file directly →
                    </a>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* Rejection reason modal */}
      {rejectTarget && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setRejectTarget(null)} />
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-md" role="dialog" aria-modal="true">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 className="font-black text-[var(--text-primary)] text-lg">Reject Receipt</h3>
              <p className="text-sm text-[var(--text-secondary)]">Tell the applicant why their receipt was rejected. This appears on their dashboard.</p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reject-reason" className="text-sm font-medium text-[var(--text-primary)]">
                  Reason <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
                </label>
                <textarea id="reject-reason" rows={3} value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectError(""); }}
                  placeholder="e.g. Screenshot unclear — transaction ID not visible."
                  className={["w-full px-3 py-2 rounded-[var(--radius-md)] border text-sm resize-none bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all",
                    rejectError ? "border-[var(--color-error)] focus:ring-[var(--color-error)]/20" : "border-[var(--border-default)] focus:border-[var(--brand-500)] focus:ring-[var(--brand-500)]/20",
                    "focus:ring-2"].join(" ")} />
                {rejectError && <p role="alert" className="text-xs text-[var(--color-error)] font-medium">{rejectError}</p>}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setRejectTarget(null)}>Cancel</Button>
                <Button variant="danger" size="md" pill loading={rejectTarget ? actionLoading[rejectTarget] : false} onClick={confirmReject}>
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
