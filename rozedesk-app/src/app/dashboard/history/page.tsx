"use client";
/**
 * /dashboard/history — Full financial history: deposits, withdrawals, sessions.
 * Data: GET /api/game/history
 *
 * Three tabs: Deposits | Withdrawals | Game Sessions.
 * DRY: Row, StatusBadge, Tab defined once.
 */
import React, { useState, useEffect, useCallback } from "react";
import { safeFetch, ApiError } from "@/lib/api";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function authHeaders() {
  const tok = typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
  return { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" } as Record<string, string>;
}

function StatusBadge({ status }: { status: string }) {
  const CLR: Record<string, string> = {
    APPROVED: "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    REJECTED: "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]   text-[var(--color-error)]",
    PENDING:  "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]",
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CLR[status] ?? CLR.PENDING}`}>{status}</span>;
}

type Tab = "deposits" | "withdrawals" | "sessions";

interface Deposit { id: string; amount: number; method: string; status: string; submittedAt: string; rejectionReason: string | null; }
interface Withdrawal { id: string; amount: number; method: string; accountNumber: string; accountName: string; status: string; submittedAt: string; rejectionReason: string | null; }
interface Session { id: string; wagerAmount: number; finalScore: number; winAmount: number; startedAt: string; endedAt: string | null; }
interface History { deposits: Deposit[]; withdrawals: Withdrawal[]; sessions: Session[]; }

export default function HistoryPage() {
  const [data,    setData]    = useState<History | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState<Tab>("deposits");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const d = await safeFetch<History>("/api/game/history", {
        credentials: "include", headers: authHeaders(),
      });
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "deposits",    label: "Deposits",    count: data?.deposits.length    ?? 0 },
    { key: "withdrawals", label: "Withdrawals", count: data?.withdrawals.length ?? 0 },
    { key: "sessions",    label: "Games",       count: data?.sessions.length    ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">History</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">All deposits, withdrawals, and game sessions</p>
      </div>

      {error && (
        <p className="text-xs font-medium text-[var(--color-error)] p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          {error}
        </p>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] w-fit">
        {TABS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={["flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-all",
              tab === t.key
                ? "bg-[var(--brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-brand)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
            ].join(" ")}>
            {t.label}
            <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full",
              tab === t.key ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]",
            ].join(" ")}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)]"/>)}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">

          {tab === "deposits" && (
            !data?.deposits.length ? <Empty label="No deposits yet." icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/> :
            data.deposits.map(d => (
              <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                <Icon path="M12 4v16m8-8H4" className="w-4 h-4 text-[var(--color-success)] flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">+Rs. {d.amount} <span className="text-[var(--text-muted)] font-normal">via {d.method}</span></p>
                  {d.rejectionReason && <p className="text-xs text-[var(--color-error)]">{d.rejectionReason}</p>}
                  <p className="text-xs text-[var(--text-muted)]">{new Date(d.submittedAt).toLocaleString("en-PK")}</p>
                </div>
                <StatusBadge status={d.status}/>
              </div>
            ))
          )}

          {tab === "withdrawals" && (
            !data?.withdrawals.length ? <Empty label="No withdrawals yet." icon="M12 4v16m-4-4l4 4 4-4"/> :
            data.withdrawals.map(w => (
              <div key={w.id} className="flex items-center gap-4 px-4 py-3">
                <Icon path="M12 4v16m-4-4l4 4 4-4" className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">-Rs. {w.amount} <span className="text-[var(--text-muted)] font-normal">via {w.method}</span></p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{w.accountName} · {w.accountNumber}</p>
                  {w.rejectionReason && <p className="text-xs text-[var(--color-error)]">{w.rejectionReason}</p>}
                  <p className="text-xs text-[var(--text-muted)]">{new Date(w.submittedAt).toLocaleString("en-PK")}</p>
                </div>
                <StatusBadge status={w.status}/>
              </div>
            ))
          )}

          {tab === "sessions" && (
            !data?.sessions.length ? <Empty label="No games played yet." icon="M5 3l14 9-14 9V3z"/> :
            data.sessions.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-4 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.winAmount > 0 ? "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]" : "bg-[var(--bg-surface)]"}`}>
                  <Icon path={s.winAmount > 0 ? "M9 12l2 2 4-4" : "M6 18L18 6M6 6l12 12"}
                    className={`w-4 h-4 ${s.winAmount > 0 ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"}`}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Score {s.finalScore}</p>
                  <p className="text-xs text-[var(--text-muted)]">Wager Rs. {s.wagerAmount} · {new Date(s.startedAt).toLocaleString("en-PK")}</p>
                </div>
                {s.winAmount > 0
                  ? <span className="text-sm font-black text-[var(--color-success)]">+Rs. {s.winAmount}</span>
                  : <span className="text-sm text-[var(--text-muted)]">—</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Empty({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <svg className="w-8 h-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={icon}/>
      </svg>
      <p className="text-[var(--text-muted)] text-sm">{label}</p>
    </div>
  );
}
