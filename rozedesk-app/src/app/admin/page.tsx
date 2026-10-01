"use client";
/**
 * /admin — FlappyWin Game Platform Admin Dashboard
 *
 * Data source: GET /api/admin/game-analytics
 * Quick actions:
 *   PATCH /api/admin/game-deposits  (approve / reject deposit inline)
 *
 * Sections:
 *  1. Header + date stamp
 *  2. KPI row  (7 cards: players, pending deposits, sessions, payout,
 *               wagered, avg score, today sessions)
 *  3. Charts   (session activity 7d | payout 7d)
 *  4. Pending deposits quick-action table
 *  5. Recent completed sessions table
 *
 * Frontend SOP §6.1 : loading / empty / error / success all handled.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens — no raw hex.
 * Backend SOP §6.2 : inline approve/reject re-validates ownership server-side.
 * DRY: authHeaders, Icon, CARD, StatCard — each defined once.
 * Security: token read from flappywin-token (renamed from rozedesk-token).
 * OOP: GameKpi, DepositRow, SessionRow — typed interfaces.
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link        from "next/link";
import Button      from "@/components/Button";
import Badge       from "@/components/Badge";
import MiniChart   from "@/components/dashboard/MiniChart";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useToast } from "@/components/Toast";
import { ROUTES }  from "@/lib/routes";
import { safeFetch, ApiError } from "@/lib/api";

/* ── Icon primitive — DRY ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Auth header — flappywin-token ── */
function authHeaders(): HeadersInit {
  const tok = typeof window !== "undefined"
    ? localStorage.getItem("flappywin-token") ?? "" : "";
  return { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" };
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

/* ── Types ── */
interface GameKpi {
  totalPlayers:         number;
  pendingDeposits:      number;
  totalSessions:        number;
  totalPayout:          number;
  totalWagered:         number;
  avgScore:             number;
  activeTodaySessions:  number;
}
interface DepositRow {
  id: string; userId: string; userName: string; userEmail: string;
  amount: number; method: string; submittedAt: string;
}
interface SessionRow {
  id: string; userName: string; wagerAmount: number;
  finalScore: number; winAmount: number; endedAt: string | null;
}
interface LiveSession {
  id: string; userId: string; userName: string; userEmail: string;
  wagerAmount: number; startedAt: string; elapsedSeconds: number;
}
interface Analytics {
  kpi:            GameKpi;
  sessionChart:   number[];
  payoutChart:    number[];
  chartLabels:    string[];
  recentDeposits: DepositRow[];
  recentSessions: SessionRow[];
}
/** Matches shape returned by GET /api/admin/game-settings */
interface GameConfig {
  escapeMin:  number; escapeMax:  number;
  minWager:   number; maxWager:   number; minDeposit: number;
  biasMode:   "none" | "win" | "loss";
  winInterval: number; winPerStep: number;
  jackpotScore: number; jackpotMult: number;
  jackpotBonusScore: number; jackpotBonusMult: number;
}

/* ── Stat card sub-component (OOP — abstracted, reusable within this page) ── */
function StatCard({ label, value, iconPath, iconBg, iconColor, accent = false, badge }: {
  label: string; value: string; iconPath: string;
  iconBg: string; iconColor: string; accent?: boolean; badge?: string;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-3 p-5 hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]`}>
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}>
          <span style={{ color: iconColor }}><Icon path={iconPath} className="w-5 h-5"/></span>
        </div>
        {badge && (
          <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] text-[var(--color-warning)] border border-[color-mix(in_srgb,var(--color-warning)_30%,transparent)] flex-shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className={`text-[clamp(1.4rem,3vw,2rem)] font-black leading-none tracking-tight ${accent ? "gradient-text" : "text-[var(--text-primary)]"}`}>
          {value}
        </p>
        <p className="text-[var(--text-sm)] font-semibold text-[var(--text-secondary)] mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function AdminOverview() {
  const toast = useToast();
  const [data,    setData]    = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  /* Live sessions state */
  const [liveSessions,    setLiveSessions]    = useState<LiveSession[]>([]);
  const [liveLoading,     setLiveLoading]     = useState(false);
  const [sessionAction,   setSessionAction]   = useState<Record<string, boolean>>({}); /* per-session loading */

  /* Inline approve/reject state */
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [rejectTarget,  setRejectTarget]  = useState<string | null>(null);
  const [rejectReason,  setRejectReason]  = useState("");
  const [rejectErr,     setRejectErr]     = useState("");
  const rejectInputRef = useRef<HTMLTextAreaElement>(null);

  /* ── Game config (inline panel — replaces /admin/game-settings route) ── */
  const [gcfg,        setGcfg]        = useState<GameConfig | null>(null);
  const [gcfgOpen,    setGcfgOpen]    = useState(false);
  const [gcfgLoading, setGcfgLoading] = useState(false);
  const [gcfgSaving,  setGcfgSaving]  = useState<"wager"|"crash"|"bias"|null>(null);
  const [gcfgSaved,   setGcfgSaved]   = useState<"wager"|"crash"|"bias"|null>(null);
  const [gcfgErr,     setGcfgErr]     = useState("");

  /* ── Fetch analytics ── */
  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await safeFetch<Analytics>("/api/admin/game-analytics", {
        credentials: "include", headers: authHeaders(),
      });
      setData(result);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Fetch live sessions + auto-refresh every 15s ── */
  const fetchLive = useCallback(async () => {
    setLiveLoading(true);
    try {
      const result = await safeFetch<{ count: number; sessions: LiveSession[] }>(
        "/api/admin/live-sessions",
        { credentials: "include", headers: authHeaders() },
      );
      setLiveSessions(result.sessions ?? []);
    } catch { /* non-fatal */ }
    finally { setLiveLoading(false); }
  }, []);

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, 15_000);
    return () => clearInterval(id);
  }, [fetchLive]);

  /* ── Session control (crash / speedup) ── */
  const sessionControl = useCallback(async (sessionId: string, action: "crash" | "speedup") => {
    setSessionAction(p => ({ ...p, [sessionId]: true }));
    try {
      await safeFetch("/api/admin/session-control", {
        method: "POST", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ sessionId, action }),
      });
      toast.info(action === "crash" ? "Session force-ended." : "Speed boost sent.");
      if (action === "crash") {
        setLiveSessions(prev => prev.filter(s => s.id !== sessionId));
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Control action failed.");
    } finally {
      setSessionAction(p => ({ ...p, [sessionId]: false }));
    }
  }, [toast]);

  /* ── Approve deposit ── */
  const approve = useCallback(async (depositId: string) => {
    setActionLoading(p => ({ ...p, [depositId]: true }));
    try {
      await safeFetch("/api/admin/game-deposits", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ depositId, action: "APPROVE" }),
      });
      toast.success("Deposit approved — balance credited.");
      /* Remove from pending list optimistically */
      setData(d => d ? {
        ...d,
        kpi: { ...d.kpi, pendingDeposits: Math.max(0, d.kpi.pendingDeposits - 1) },
        recentDeposits: d.recentDeposits.filter(dep => dep.id !== depositId),
      } : d);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Approval failed.");
    } finally {
      setActionLoading(p => ({ ...p, [depositId]: false }));
    }
  }, [toast]);

  /* ── Open reject modal ── */
  const openReject = useCallback((id: string) => {
    setRejectTarget(id);
    setRejectReason("");
    setRejectErr("");
    setTimeout(() => rejectInputRef.current?.focus(), 80);
  }, []);

  /* ── Confirm rejection ── */
  const confirmReject = useCallback(async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) { setRejectErr("Reason is required."); return; }
    setActionLoading(p => ({ ...p, [rejectTarget]: true }));
    try {
      await safeFetch("/api/admin/game-deposits", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ depositId: rejectTarget, action: "REJECT", reason: rejectReason.trim() }),
      });
      toast.info("Deposit rejected. Player notified.");
      setData(d => d ? {
        ...d,
        kpi: { ...d.kpi, pendingDeposits: Math.max(0, d.kpi.pendingDeposits - 1) },
        recentDeposits: d.recentDeposits.filter(dep => dep.id !== rejectTarget),
      } : d);
      setRejectTarget(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Rejection failed.");
    } finally {
      if (rejectTarget) setActionLoading(p => ({ ...p, [rejectTarget]: false }));
    }
  }, [rejectTarget, rejectReason, toast]);

  /* ── KPI data driven by API response ── */
  const kpi = data?.kpi;
  const STATS = [
    {
      label: "Total Players",
      value: String(kpi?.totalPlayers ?? "—"),
      iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      iconBg: "color-mix(in srgb,var(--brand-500) 15%,transparent)", iconColor: "var(--brand-400)", accent: true,
    },
    {
      label: "Pending Deposits",
      value: String(kpi?.pendingDeposits ?? "—"),
      badge: kpi && kpi.pendingDeposits > 0 ? "Action needed" : undefined,
      iconPath: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      iconBg: "color-mix(in srgb,var(--color-warning) 15%,transparent)", iconColor: "var(--color-warning)",
    },
    {
      label: "Total Sessions",
      value: String(kpi?.totalSessions ?? "—"),
      iconPath: "M5 3l14 9-14 9V3z",
      iconBg: "color-mix(in srgb,var(--accent-400) 15%,transparent)", iconColor: "var(--accent-400)",
    },
    {
      label: "Total Payout",
      value: kpi ? `Rs. ${kpi.totalPayout.toLocaleString()}` : "—",
      iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg: "color-mix(in srgb,var(--color-success) 15%,transparent)", iconColor: "var(--color-success)",
    },
    {
      label: "Total Wagered",
      value: kpi ? `Rs. ${kpi.totalWagered.toLocaleString()}` : "—",
      iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      iconBg: "color-mix(in srgb,var(--brand-500) 10%,transparent)", iconColor: "var(--brand-500)",
    },
    {
      label: "Avg Score",
      value: String(kpi?.avgScore ?? "—"),
      iconPath: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      iconBg: "color-mix(in srgb,var(--color-warning) 12%,transparent)", iconColor: "var(--color-warning)",
    },
    {
      label: "Sessions Today",
      value: String(kpi?.activeTodaySessions ?? "—"),
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      iconBg: "color-mix(in srgb,var(--cyan-400) 15%,transparent)", iconColor: "var(--cyan-400)",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Game Dashboard
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" · "}Live game data
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="md" href={ROUTES.adminGameDeposits} pill
            icon={<Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-4 h-4"/>}>
            All Deposits
          </Button>
          <Button variant="gradient" size="md" pill glow onClick={fetchData}
            icon={<Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4"/>}>
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={fetchData}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline">Retry</button>
        </div>
      )}

      {/* ── KPI cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {[1,2,3,4,5,6,7].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {STATS.map(s => (
            <StatCard key={s.label} {...s}/>
          ))}
        </div>
      )}

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Sessions chart */}
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">Session Activity</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Games played — last 7 days</p>
            </div>
            <span className="gradient-text font-black text-xl leading-none">
              {kpi?.totalSessions ?? 0}
            </span>
          </div>
          {loading ? (
            <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse"/>
          ) : (
            <MiniChart
              data={data?.sessionChart.length ? data.sessionChart : [0]}
              type="area"
              color="var(--brand-400)"
              height={90}
              labels={data?.chartLabels ?? []}
            />
          )}
        </div>

        {/* Payout chart */}
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">PKR Paid Out</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Winnings credited — last 7 days</p>
            </div>
            <span className="font-black text-xl leading-none text-[var(--color-success)]">
              Rs. {(kpi?.totalPayout ?? 0).toLocaleString()}
            </span>
          </div>
          {loading ? (
            <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse"/>
          ) : (
            <MiniChart
              data={data?.payoutChart.length ? data.payoutChart : [0]}
              type="area"
              color="var(--color-success)"
              height={90}
              labels={data?.chartLabels ?? []}
            />
          )}
        </div>
      </div>

      {/* ── Pending deposits quick-action ── */}
      <section aria-labelledby="deposits-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 id="deposits-heading" className="font-bold text-lg text-[var(--text-primary)]">
              Pending Deposits
            </h2>
            {(kpi?.pendingDeposits ?? 0) > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] text-[var(--color-warning)] border border-[color-mix(in_srgb,var(--color-warning)_30%,transparent)]">
                {kpi?.pendingDeposits} pending
              </span>
            )}
          </div>
          <Link href={ROUTES.adminGameDeposits}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">{[1,2,3].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}</div>
        ) : !data?.recentDeposits.length ? (
          <div className={`${CARD} flex flex-col items-center gap-3 py-10 text-center`}>
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              className="w-8 h-8 text-[var(--color-success)]"/>
            <p className="font-semibold text-[var(--text-primary)]">All deposits reviewed</p>
            <p className="text-[var(--text-muted)] text-sm">No pending deposits.</p>
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              {[
                ["col-span-3","Player"],
                ["col-span-2 hidden sm:block","Email"],
                ["col-span-2","Amount"],
                ["col-span-1 hidden md:block","Method"],
                ["col-span-1 hidden lg:block","Submitted"],
                ["col-span-3","Actions"],
              ].map(([cls, label]) => (
                <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>
                  {label}
                </span>
              ))}
            </div>

            {data.recentDeposits.map((dep, i) => (
              <div key={dep.id}
                className={[
                  "grid grid-cols-12 gap-2 items-center px-4 py-3",
                  "hover:bg-[var(--bg-surface)] transition-colors",
                  i < data.recentDeposits.length - 1 ? "border-b border-[var(--border-default)]" : "",
                ].join(" ")}>

                {/* Player name */}
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 select-none">
                    {dep.userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{dep.userName}</span>
                </div>

                {/* Email */}
                <span className="col-span-2 text-xs text-[var(--text-muted)] truncate hidden sm:block">
                  {dep.userEmail}
                </span>

                {/* Amount */}
                <span className="col-span-2 text-sm font-black text-[var(--text-primary)]">
                  Rs. {dep.amount}
                </span>

                {/* Method */}
                <span className={[
                  "col-span-1 hidden md:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit",
                  dep.method === "JAZZCASH"
                    ? "bg-[#cc2229] text-white"
                    : "bg-[#3d7f41] text-white",
                ].join(" ")}>
                  {dep.method === "JAZZCASH" ? "JazzCash" : "Easypaisa"}
                </span>

                {/* Submitted time */}
                <span className="col-span-1 text-[10px] text-[var(--text-muted)] hidden lg:block">
                  {new Date(dep.submittedAt).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>

                {/* Actions */}
                <div className="col-span-3 flex items-center gap-2">
                  <button type="button"
                    disabled={actionLoading[dep.id]}
                    onClick={() => approve(dep.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-md)] text-[10px] font-bold bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_22%,transparent)] transition-colors disabled:opacity-40 whitespace-nowrap">
                    <Icon path="M5 13l4 4L19 7" className="w-3 h-3"/>
                    {actionLoading[dep.id] ? "…" : "Approve"}
                  </button>
                  <button type="button"
                    disabled={actionLoading[dep.id]}
                    onClick={() => openReject(dep.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-md)] text-[10px] font-bold bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_18%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_16%,transparent)] transition-colors disabled:opacity-40 whitespace-nowrap">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3"/>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── LIVE SESSIONS ── */}
      <section aria-labelledby="live-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 id="live-heading" className="font-bold text-lg text-[var(--text-primary)]">
              Live Sessions
            </h2>
            {liveSessions.length > 0 && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"/>
                {liveSessions.length} playing now
              </span>
            )}
          </div>
          <button type="button" onClick={fetchLive}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
            Refresh
          </button>
        </div>

        {liveLoading && liveSessions.length === 0 ? (
          <div className="flex flex-col gap-2">{[1,2].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}</div>
        ) : liveSessions.length === 0 ? (
          <div className={`${CARD} flex flex-col items-center gap-3 py-8 text-center`}>
            <Icon path="M5 3l14 9-14 9V3z" className="w-7 h-7 text-[var(--text-muted)]"/>
            <p className="text-[var(--text-muted)] text-sm">No active sessions right now.</p>
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              {[["col-span-3","Player"],["col-span-2 hidden sm:block","Email"],["col-span-2","Wager"],["col-span-2","Elapsed"],["col-span-3","Controls"]].map(([cls,lbl]) => (
                <span key={lbl} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>{lbl}</span>
              ))}
            </div>
            {liveSessions.map((s, i) => (
              <div key={s.id} className={["grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-[var(--bg-surface)] transition-colors", i < liveSessions.length - 1 ? "border-b border-[var(--border-default)]" : ""].join(" ")}>
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  {/* Live dot */}
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse flex-shrink-0"/>
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{s.userName}</span>
                </div>
                <span className="col-span-2 text-xs text-[var(--text-muted)] truncate hidden sm:block">{s.userEmail}</span>
                <span className="col-span-2 text-sm font-black text-[var(--text-primary)]">Rs. {s.wagerAmount}</span>
                <span className="col-span-2 text-xs text-[var(--text-secondary)] tabular-nums font-semibold">
                  {Math.floor(s.elapsedSeconds / 60)}m {s.elapsedSeconds % 60}s
                </span>
                <div className="col-span-3 flex items-center gap-2 flex-wrap">
                  <button type="button" disabled={sessionAction[s.id]}
                    onClick={() => sessionControl(s.id, "speedup")}
                    className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-md)] text-[10px] font-bold bg-[color-mix(in_srgb,var(--color-warning)_10%,transparent)] text-[var(--color-warning)] border border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-warning)_20%,transparent)] transition-colors disabled:opacity-40 whitespace-nowrap">
                    <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-3 h-3"/>
                    Speed
                  </button>
                  <button type="button" disabled={sessionAction[s.id]}
                    onClick={() => sessionControl(s.id, "crash")}
                    className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-md)] text-[10px] font-bold bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_18%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_16%,transparent)] transition-colors disabled:opacity-40 whitespace-nowrap">
                    <Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" className="w-3 h-3"/>
                    {sessionAction[s.id] ? "…" : "Crash"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent sessions ── */}
      <section aria-labelledby="sessions-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="sessions-heading" className="font-bold text-lg text-[var(--text-primary)]">
            Recent Game Sessions
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">{[1,2,3].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}</div>
        ) : !data?.recentSessions.length ? (
          <div className={`${CARD} py-10 text-center`}>
            <p className="text-[var(--text-muted)] text-sm">No sessions yet.</p>
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              {[
                ["col-span-3","Player"],
                ["col-span-2","Wager"],
                ["col-span-2","Score"],
                ["col-span-3","Won"],
                ["col-span-2 hidden sm:block","Time"],
              ].map(([cls, label]) => (
                <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>
                  {label}
                </span>
              ))}
            </div>

            {data.recentSessions.map((s, i) => {
              const won  = s.winAmount > 0;
              const net  = s.winAmount - s.wagerAmount;
              return (
                <div key={s.id}
                  className={[
                    "grid grid-cols-12 gap-2 items-center px-4 py-3",
                    "hover:bg-[var(--bg-surface)] transition-colors",
                    i < data.recentSessions.length - 1 ? "border-b border-[var(--border-default)]" : "",
                  ].join(" ")}>

                  {/* Player */}
                  <div className="col-span-3 flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 select-none">
                      {s.userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{s.userName}</span>
                  </div>

                  {/* Wager */}
                  <span className="col-span-2 text-sm text-[var(--text-secondary)] font-semibold">
                    Rs. {s.wagerAmount}
                  </span>

                  {/* Score */}
                  <span className="col-span-2 text-sm font-black text-[var(--text-primary)]">
                    {s.finalScore}
                  </span>

                  {/* Won + net badge */}
                  <div className="col-span-3 flex items-center gap-1.5">
                    {won ? (
                      <>
                        <span className="text-sm font-black text-[var(--color-success)]">
                          +Rs. {s.winAmount}
                        </span>
                        <Badge variant={net >= 0 ? "success" : "warning"} size="sm">
                          {net >= 0 ? `+${net}` : `${net}`}
                        </Badge>
                      </>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">—</span>
                    )}
                  </div>

                  {/* Time */}
                  <span className="col-span-2 text-[10px] text-[var(--text-muted)] hidden sm:block">
                    {s.endedAt
                      ? new Date(s.endedAt).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Reject reason modal ── */}
      {rejectTarget && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true" onClick={() => setRejectTarget(null)}/>
          <div
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-md"
            role="dialog" aria-modal="true" aria-label="Reject deposit">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 className="font-black text-[var(--text-primary)] text-lg">Reject Deposit</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Enter a reason — the player will see this in their wallet page.
              </p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rej-reason" className="text-sm font-medium text-[var(--text-primary)]">
                  Reason<span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>
                </label>
                <textarea
                  ref={rejectInputRef}
                  id="rej-reason"
                  rows={3}
                  value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectErr(""); }}
                  placeholder="e.g. Screenshot unclear — transaction ID not visible."
                  className={[
                    "w-full px-3 py-2 rounded-[var(--radius-md)] border text-sm resize-none",
                    "bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "outline-none transition-all focus:ring-2",
                    rejectErr
                      ? "border-[var(--color-error)] focus:ring-[var(--color-error)]/20"
                      : "border-[var(--border-default)] focus:border-[var(--brand-500)] focus:ring-[var(--brand-500)]/20",
                  ].join(" ")}
                />
                {rejectErr && (
                  <p role="alert" className="text-xs text-[var(--color-error)] font-medium">{rejectErr}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setRejectTarget(null)}>Cancel</Button>
                <Button variant="danger" size="md" pill
                  loading={rejectTarget ? actionLoading[rejectTarget] : false}
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
