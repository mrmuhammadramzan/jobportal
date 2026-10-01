"use client";
/**
 * /dashboard — FlappyWin Player Overview
 *
 * Sections:
 *  1. Welcome banner + balance quick-view
 *  2. Stats row  (Balance / Earned / Games Played / Best Score)
 *  3. Score activity chart (last 7 sessions)
 *  4. Recent game sessions list
 *  5. Deposit history (last 3)
 *  6. Quick-play CTA
 *
 * Data: GET /api/game/wallet — returns balance, sessions[], deposits[]
 *
 * Frontend SOP §6.1: loading / empty / error / populated all handled.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens — no raw hex.
 * DRY: Icon, StatCard, token() — each defined once.
 * OOP: WalletData, SessionRecord, DepositRecord — typed interfaces.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link        from "next/link";
import Button      from "@/components/Button";
import DepositModal from "@/components/game/DepositModal";
import MiniChart   from "@/components/dashboard/MiniChart";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { ROUTES }  from "@/lib/routes";
import { GAME }    from "@/lib/gameConstants";
import { safeFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/* ── Icon primitive ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Auth token from localStorage (renamed from rozedesk-token) ── */
function token() {
  return typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
}
function authHeaders() {
  return { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" } as Record<string, string>;
}

/* ── Types ── */
interface SessionRecord {
  id: string; wagerAmount: number; finalScore: number;
  winAmount: number; startedAt: string; completed: boolean;
}
interface DepositRecord {
  id: string; amount: number; method: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string; rejectionReason: string | null;
}
interface WalletData {
  balance: number; walletId: string;
  sessions: SessionRecord[];
  deposits: DepositRecord[];
  minDeposit: number; minWager: number;
}

/* ── Stat pill ── */
function StatCard({ label, value, icon, iconBg, iconColor, accent = false }: {
  label: string; value: string; icon: string;
  iconBg: string; iconColor: string; accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]">
      <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}>
        <span style={{ color: iconColor }}><Icon path={icon} className="w-5 h-5"/></span>
      </div>
      <div>
        <p className={`text-2xl font-black leading-none ${accent ? "gradient-text" : "text-[var(--text-primary)]"}`}>
          {value}
        </p>
        <p className="text-[var(--text-sm)] font-semibold text-[var(--text-secondary)] mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ── Session status colour ── */
const DEPOSIT_COLOR: Record<string, string> = {
  APPROVED: "text-[var(--color-success)]",
  REJECTED: "text-[var(--color-error)]",
  PENDING:  "text-[var(--color-warning)]",
};
const DEPOSIT_BG: Record<string, string> = {
  APPROVED: "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]",
  REJECTED: "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]",
  PENDING:  "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]",
};

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function PlayerDashboard() {
  const { user } = useAuth();
  const [wallet,       setWallet]       = useState<WalletData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [depositOpen,  setDepositOpen]  = useState(false);

  /* ── Fetch wallet data ── */
  const loadWallet = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await safeFetch<WalletData>("/api/game/wallet", {
        credentials: "include", headers: authHeaders(),
      });
      setWallet(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load wallet. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWallet(); }, [loadWallet]);

  /* ── Derived values ── */
  const sessions     = wallet?.sessions ?? [];
  const deposits     = wallet?.deposits ?? [];
  const balance      = wallet?.balance ?? 0;
  const totalEarned  = useMemo(() => sessions.reduce((s, g) => s + g.winAmount, 0), [sessions]);
  const bestScore    = useMemo(() => Math.max(0, ...sessions.map(g => g.finalScore)), [sessions]);
  const totalGames   = sessions.length;

  /* ── 7-session score sparkline (most recent 7 in order) ── */
  const scoreChart = useMemo(() => {
    const recent = [...sessions].reverse().slice(0, 7);
    while (recent.length < 7) recent.unshift({ finalScore: 0 } as SessionRecord);
    return recent.map(s => s.finalScore);
  }, [sessions]);

  const firstName = user?.name?.split(" ")[0] ?? "";

  const STATS = [
    {
      label: "Balance",
      value: `Rs. ${balance}`,
      icon:  "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      iconBg: "color-mix(in srgb,var(--brand-500) 14%,transparent)",
      iconColor: "var(--brand-500)", accent: true,
    },
    {
      label: "Total Earned",
      value: `Rs. ${totalEarned}`,
      icon:  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg: "color-mix(in srgb,var(--color-success) 14%,transparent)",
      iconColor: "var(--color-success)",
    },
    {
      label: "Games Played",
      value: String(totalGames),
      icon:  "M5 3l14 9-14 9V3z",
      iconBg: "color-mix(in srgb,var(--accent-400) 14%,transparent)",
      iconColor: "var(--accent-400)",
    },
    {
      label: "Best Score",
      value: String(bestScore),
      icon:  "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      iconBg: "color-mix(in srgb,var(--color-warning) 14%,transparent)",
      iconColor: "var(--color-warning)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* ── Welcome banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            {loading ? "Loading your wallet…"
              : error   ? "There was a problem loading your wallet."
              : balance < (wallet?.minWager ?? GAME.MIN_WAGER)
                ? `Your balance is Rs. ${balance} — top up to start playing.`
                : `Your balance is Rs. ${balance}. Ready to play!`
            }
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="md" onClick={() => setDepositOpen(true)} pill
            icon={<Icon path="M12 4v16m8-8H4" className="w-4 h-4"/>}>
            Deposit
          </Button>
          <Button variant="gradient" size="md" href={ROUTES.game} pill glow
            icon={<Icon path="M5 3l14 9-14 9V3z" className="w-4 h-4"/>}>
            Play Now
          </Button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={loadWallet}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* ── Low balance prompt ── */}
      {!loading && !error && balance < (wallet?.minWager ?? GAME.MIN_WAGER) && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-[var(--radius-xl)] bg-[color-mix(in_srgb,var(--color-warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)]">
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            className="w-6 h-6 text-[var(--color-warning)] flex-shrink-0"/>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-[var(--text-primary)] text-sm">
              {balance === 0 ? "Your wallet is empty." : `Balance Rs. ${balance} is below the minimum wager.`}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Deposit at least Rs. {wallet?.minDeposit ?? GAME.MIN_DEPOSIT} to start playing.
            </p>
          </div>
          <Button variant="gradient" size="sm" onClick={() => setDepositOpen(true)} pill>Top Up</Button>
        </div>
      )}

      {/* ── Stats row ── */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* ── Score activity chart ── */}
      <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Score Activity</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Your last 7 games</p>
          </div>
          <span className="gradient-text font-black text-lg leading-none">{bestScore}</span>
        </div>
        {loading ? (
          <div className="h-20 bg-[var(--bg-surface)] rounded animate-pulse" />
        ) : (
          <MiniChart data={scoreChart} type="area" color="var(--brand-500)" height={80}
            labels={["–6","–5","–4","–3","–2","–1","Latest"]} />
        )}
        {!loading && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
            <span className="text-xs text-[var(--text-muted)]">
              {totalGames} game{totalGames !== 1 ? "s" : ""} total
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Best: {bestScore} pts
            </span>
          </div>
        )}
      </div>

      {/* ── Recent games ── */}
      <section aria-labelledby="games-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="games-heading" className="font-bold text-lg text-[var(--text-primary)]">
            Recent Games
          </h2>
          <Link href={ROUTES.game}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
            Play again →
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
            <Icon path="M5 3l14 9-14 9V3z" className="w-8 h-8 text-[var(--text-muted)]"/>
            <p className="font-semibold text-[var(--text-primary)]">No games yet</p>
            <p className="text-[var(--text-secondary)] text-sm">Deposit and play your first game — winnings appear here.</p>
            <Button variant="gradient" size="md" href={ROUTES.game} pill>Play Now</Button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
            {sessions.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-surface)] transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  s.winAmount > 0
                    ? "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]"
                    : "bg-[var(--bg-base)]"
                }`}>
                  <Icon
                    path={s.winAmount > 0 ? "M9 12l2 2 4-4" : "M6 18L18 6M6 6l12 12"}
                    className={`w-4 h-4 ${s.winAmount > 0 ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Score {s.finalScore}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Wager Rs. {s.wagerAmount} · {new Date(s.startedAt).toLocaleDateString("en-PK", { day:"numeric", month:"short" })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {s.winAmount > 0 ? (
                    <span className="text-sm font-black text-[var(--color-success)]">+Rs. {s.winAmount}</span>
                  ) : (
                    <span className="text-sm text-[var(--text-muted)]">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Deposit history ── */}
      {deposits.length > 0 && (
        <section aria-labelledby="deposits-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="deposits-heading" className="font-bold text-lg text-[var(--text-primary)]">
              Recent Deposits
            </h2>
            <Link href={ROUTES.game}
              className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
              Add balance →
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
            {deposits.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  d.status === "APPROVED" ? "bg-[var(--color-success)]"
                  : d.status === "REJECTED" ? "bg-[var(--color-error)]"
                  : "bg-[var(--color-warning)]"
                }`} aria-label={d.status}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Rs. {d.amount} via {d.method}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {new Date(d.submittedAt).toLocaleDateString("en-PK", { day:"numeric", month:"short" })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DEPOSIT_BG[d.status]} ${DEPOSIT_COLOR[d.status]}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Prize guide ── */}
      <section aria-labelledby="prizes-heading" className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5">
        <h2 id="prizes-heading" className="font-bold text-[var(--text-primary)] text-base mb-4">
          Earning Guide
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { score: "100 pts",  earn: "+Rs. 10",    note: "Milestone bonus" },
            { score: "200 pts",  earn: "+Rs. 20",    note: "Cumulative" },
            { score: "1,000 pts",earn: "+Wager back",note: "Full jackpot" },
            { score: "1,200 pts",earn: "+Wager ×1.2",note: "20% profit" },
          ].map(row => (
            <div key={row.score}
              className="flex flex-col gap-1 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-base)] border border-[var(--border-default)] text-center">
              <span className="font-black text-[var(--text-primary)]">{row.score}</span>
              <span className="font-bold text-[var(--color-success)]">{row.earn}</span>
              <span className="text-[var(--text-muted)]">{row.note}</span>
            </div>
          ))}
        </div>
      </section>

      {depositOpen && wallet && (
        <DepositModal
          minDeposit={wallet.minDeposit}
          onClose={() => setDepositOpen(false)}
          onSuccess={() => { setDepositOpen(false); loadWallet(); }}
        />
      )}

    </div>
  );
}
