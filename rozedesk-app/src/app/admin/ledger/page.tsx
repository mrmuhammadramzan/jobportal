"use client";
/**
 * /admin/ledger — Earnings Ledger, fully wired to real API.
 *
 * API: GET /api/admin/ledger?period=&status=&q=
 * Returns: { transactions, summary, revenueByJob, chartData }
 *
 * Frontend SOP §6.1: loading / empty / populated / error states.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: authHeaders(), pkr(), Icon, CARD, TX_BADGE — each defined once.
 * Export CSV built from real transaction data.
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Badge     from "@/components/Badge";
import Button    from "@/components/Button";
import MiniChart from "@/components/dashboard/MiniChart";
import DateFilter, { useDefaultDateRange, buildApiParams, type DateRange } from "@/components/dashboard/DateFilter";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { PLATFORM_CUT_PCT } from "@/lib/constants";
import { useFee } from "@/hooks/useFee";
import { safeFetch, ApiError } from "@/lib/api";

/* ── Shared helpers ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

function pkr(n: number): string {
  return `PKR ${n.toLocaleString()}`;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

/* ── Types ── */
type TxStatus = "pending" | "approved" | "rejected" | "refunded";

interface Transaction {
  id:                string;
  applicantName:     string;
  applicantInitials: string;
  jobTitle:          string;
  jobId:             string;
  amount:            number;
  net:               number;
  method:            string;
  receiptRef:        string | null;
  status:            TxStatus;
  submittedAt:       string;
}

interface Summary {
  totalGross:    number;
  totalNet:      number;
  pendingAmt:    number;
  approvedCount: number;
  pendingCount:  number;
  avgDaily:      number;
}

interface RevenueJob {
  jobId:      string;
  title:      string;
  applicants: number;
  gross:      number;
  net:        number;
}

const TX_BADGE: Record<TxStatus, "success"|"warning"|"error"|"neutral"> = {
  approved: "success", pending: "warning", rejected: "error", refunded: "neutral",
};
const TX_LABEL: Record<TxStatus, string> = {
  approved: "Approved", pending: "Pending", rejected: "Rejected", refunded: "Refunded",
};

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */
export default function LedgerPage() {
  const appFee     = useFee();
  const [dateRange, setDateRange] = useState<DateRange>(useDefaultDateRange());
  const [statusFilter, setStatusFilter] = useState<TxStatus | "all">("all");
  const [search,    setSearch]    = useState("");

  /* ── Remote state ── */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary,      setSummary]      = useState<Summary | null>(null);
  const [revenueByJob, setRevenueByJob] = useState<RevenueJob[]>([]);
  const [chartData,    setChartData]    = useState<number[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  /* Live platform cut from API */
  const [cutPct, setCutPct] = useState(PLATFORM_CUT_PCT);
  const cut = (100 - cutPct) / 100;

  /* ── Fetch on period change ── */
  const fetchLedger = useCallback(async (range: DateRange) => {
    setLoading(true); setError("");
    try {
      const qs   = buildApiParams(range);
      /* safeFetch: single parse, content-type guard, throws ApiError on !ok */
      const data = await safeFetch<{
        transactions: Transaction[];
        summary:      Summary | null;
        revenueByJob: RevenueJob[];
        chartData:    number[];
      }>(`/api/admin/ledger?${qs}`, {
        headers: authHeaders(), credentials: "include",
      });
      setTransactions(data.transactions ?? []);
      setSummary(data.summary ?? null);
      setRevenueByJob(data.revenueByJob ?? []);
      setChartData(data.chartData ?? []);
      if (data.summary && "cutPct" in data.summary) {
        setCutPct((data.summary as Summary & { cutPct?: number }).cutPct ?? PLATFORM_CUT_PCT);
      }
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to load ledger.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger(dateRange);
  }, [dateRange, fetchLedger]);

  /* ── Client-side filter + search on fetched data ── */
  const filteredTx = useMemo(() =>
    transactions.filter(tx => {
      const matchStatus = statusFilter === "all" || tx.status === statusFilter;
      const matchSearch = search === "" ||
        tx.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        tx.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [transactions, statusFilter, search]
  );

  /* ── Counts per status tab ── */
  const txCounts = useMemo(() => ({
    all:      transactions.length,
    approved: transactions.filter(t => t.status === "approved").length,
    pending:  transactions.filter(t => t.status === "pending").length,
    rejected: transactions.filter(t => t.status === "rejected").length,
    refunded: transactions.filter(t => t.status === "refunded").length,
  }), [transactions]);

  /* ── CSV Export — uses filtered results or all if no filter ── */
  function exportCsv() {
    const rows = filteredTx.map(t =>
      [t.id, t.applicantName, t.jobTitle, t.amount, t.net, t.status, t.method, new Date(t.submittedAt).toLocaleString()].join(",")
    );
    const csv  = ["ID,Applicant,Job,Amount,Net,Status,Method,Date", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `rozedesk-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Derived summary values ── */
  const totalNet   = summary?.totalNet   ?? 0;
  const totalGross = summary?.totalGross ?? 0;
  const pendingAmt = summary?.pendingAmt ?? 0;
  const avgDaily   = summary?.avgDaily   ?? 0;

  const KPI_CARDS = [
    { label:`Earnings (${dateRange.preset})`, value:pkr(totalNet),  sub:`${summary?.approvedCount ?? 0} approved`,        icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", iconBg:"color-mix(in srgb,var(--color-success) 15%,transparent)", iconColor:"var(--color-success)" },
    { label:"Total Gross",                    value:pkr(totalGross), sub:`Net: ${pkr(totalNet)}`,                           icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",                iconBg:"color-mix(in srgb,var(--brand-500) 15%,transparent)",        iconColor:"var(--brand-400)"    },
    { label:"Pending Payout",                 value:pkr(pendingAmt), sub:`${summary?.pendingCount ?? 0} transactions`,      icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                                                                                                                                         iconBg:"color-mix(in srgb,var(--color-warning) 15%,transparent)", iconColor:"var(--color-warning)" },
    { label:"Avg. Daily (14d)",               value:pkr(avgDaily),   sub:"Net per day",                                    icon:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",                                                                                                                                                                                                                       iconBg:"color-mix(in srgb,var(--accent-400) 15%,transparent)",    iconColor:"var(--accent-400)"   },
  ];

  /* ── Day labels for chart ── */
  const CHART_LABELS = ["M","T","W","T","F","S","S","M","T","W","T","F","S","S"];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Earnings Ledger</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            Application fee: <span className="font-semibold text-[var(--text-primary)]">PKR {appFee}</span> per submission
            <span className="mx-2 text-[var(--border-default)]">·</span>
            Platform keeps <span className="font-semibold text-[var(--text-primary)]">{cutPct}%</span>
          </p>
        </div>
        <Button variant="outline" size="md" pill className="flex-shrink-0"
          onClick={exportCsv}
          iconLeft={<Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />}>
          Export CSV
        </Button>
      </div>

      {/* Date filter */}
      <DateFilter value={dateRange} onChange={setDateRange} />

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" />
          <p className="text-sm font-medium text-[var(--color-error)]">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => fetchLedger(dateRange)}>Retry</Button>
        </div>
      )}

      {/* KPI cards */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {KPI_CARDS.map(k => (
            <div key={k.label} className={`${CARD} flex flex-col gap-4 p-5 hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]`}>
              <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: k.iconBg }}>
                <span style={{ color: k.iconColor }}><Icon path={k.icon} className="w-5 h-5" /></span>
              </div>
              <div>
                <p className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-black leading-tight tracking-tight gradient-text">{k.value}</p>
                <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] mt-1">{k.label}</p>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-0.5">{k.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily earnings chart */}
      <div className={`${CARD} p-5`}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Daily Earnings</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Last 14 days — net revenue (PKR)</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="gradient-text font-black text-xl leading-none">{pkr(totalNet)}</p>
          </div>
        </div>
        {loading ? (
          <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse" />
        ) : (
          <MiniChart
            data={chartData.map(v => Math.round(v / 100))}
            type="area" color="var(--color-success)" height={90}
            labels={CHART_LABELS}
          />
        )}
        {!loading && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
            <span className="text-[var(--text-muted)] text-xs">Peak day: {pkr(Math.max(0, ...chartData))}</span>
            <span className="text-[var(--text-muted)] text-xs">Avg/day: {pkr(avgDaily)}</span>
          </div>
        )}
      </div>

      {/* Revenue by job */}
      <div className={`${CARD} p-5`}>
        <p className="font-bold text-[var(--text-primary)] text-base mb-1">Revenue by Job Listing</p>
        <p className="text-[var(--text-muted)] text-xs mb-5">Total earned per listing (all time, approved payments)</p>

        {loading ? (
          <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-8 bg-[var(--bg-surface)] rounded animate-pulse" />)}</div>
        ) : revenueByJob.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">No approved payments yet.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {revenueByJob.map((job, i) => {
                const maxNet = revenueByJob[0]?.net || 1;
                const pct    = Math.round((job.net / maxNet) * 100);
                return (
                  <div key={job.jobId} className="flex items-center gap-4">
                    <span className="text-[var(--text-muted)] text-xs font-bold w-5 flex-shrink-0">#{i+1}</span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{job.title}</span>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                          <span className="text-xs text-[var(--text-muted)]">{job.applicants} apps</span>
                          <span className="text-sm font-bold text-[var(--text-primary)] w-24 text-right">{pkr(job.net)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text-primary)]">Total (all listings)</span>
              <span className="text-sm font-black gradient-text">{pkr(revenueByJob.reduce((a, j) => a + j.net, 0))}</span>
            </div>
          </>
        )}
      </div>

      {/* Transaction table */}
      <section aria-labelledby="tx-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 id="tx-heading" className="font-bold text-lg text-[var(--text-primary)]">Transactions</h2>
          <p className="text-[var(--text-muted)] text-xs">
            Net per app (after {cutPct}% cut):{" "}
            <strong className="text-[var(--text-primary)]">PKR {Math.round(appFee * cut)}</strong>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] flex-shrink-0 overflow-x-auto"
            role="group" aria-label="Filter by status">
            {(["all", "approved", "pending", "rejected", "refunded"] as const).map(tab => (
              <button key={tab} type="button" aria-pressed={statusFilter === tab}
                onClick={() => setStatusFilter(tab)}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap capitalize",
                  "transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                  statusFilter === tab
                    ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
                ].join(" ")}>
                {tab === "all" ? "All" : TX_LABEL[tab as TxStatus]}
                <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                  statusFilter === tab ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"].join(" ")}>
                  {txCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <label htmlFor="tx-search" className="sr-only">Search transactions</label>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4" />
            </div>
            <input id="tx-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by applicant, job, or ID…"
              className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col gap-2">{[1,2,3,4,5].map(i => <SkeletonCard key={i} lines={1} />)}</div>
        ) : filteredTx.length === 0 ? (
          <div className={`${CARD} flex flex-col items-center gap-3 py-12 text-center`}>
            <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="font-semibold text-[var(--text-primary)]">No transactions found</p>
            <p className="text-[var(--text-muted)] text-sm">{search || statusFilter !== "all" ? "Try adjusting your search or filter." : "No payments have been submitted yet."}</p>
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              {[["col-span-1","ID"],["col-span-3","Applicant"],["col-span-3 hidden md:block","Job"],
                ["col-span-2","Amount"],["col-span-1 hidden sm:block","Status"],["col-span-2 hidden lg:block","Date"]
              ].map(([cls, label]) => (
                <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>{label}</span>
              ))}
            </div>

            {filteredTx.map((tx, i) => (
              <div key={tx.id} className={[
                "grid grid-cols-12 gap-3 items-center px-5 py-3.5",
                "hover:bg-[var(--bg-surface)] transition-colors duration-[var(--dur-fast)]",
                i < filteredTx.length - 1 ? "border-b border-[var(--border-default)]" : "",
              ].join(" ")}>
                <span className="col-span-1 text-[var(--text-muted)] text-xs font-mono truncate">{tx.id.slice(0, 8)}…</span>

                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                    {tx.applicantInitials}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{tx.applicantName}</span>
                </div>

                <span className="col-span-3 text-[var(--text-secondary)] text-sm hidden md:block truncate">{tx.jobTitle}</span>

                <div className="col-span-2 flex flex-col">
                  <span className="text-[var(--text-primary)] font-bold text-sm">{pkr(tx.amount)}</span>
                  {tx.status === "approved" && (
                    <span className="text-[10px] text-[var(--color-success)] font-semibold">Net: {pkr(tx.net)}</span>
                  )}
                  {tx.status === "refunded" && (
                    <span className="text-[10px] text-[var(--color-error)] font-semibold">Refunded</span>
                  )}
                </div>

                <div className="col-span-1 hidden sm:block">
                  <Badge variant={TX_BADGE[tx.status]} size="sm" dot>{TX_LABEL[tx.status]}</Badge>
                </div>

                <div className="col-span-2 hidden lg:flex flex-col">
                  <span className="text-[var(--text-secondary)] text-xs">{new Date(tx.submittedAt).toLocaleDateString()}</span>
                  <span className="text-[var(--text-muted)] text-[10px]">{new Date(tx.submittedAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTx.length > 0 && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-[var(--text-muted)] text-xs">Showing {filteredTx.length} of {transactions.length} transactions</p>
            <p className="text-[var(--text-muted)] text-xs">
              Filtered net total:{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {pkr(filteredTx.filter(t => t.status === "approved").reduce((a, t) => a + t.net, 0))}
              </span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
