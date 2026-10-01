"use client";
/**
 * /admin/players — Player management table.
 *
 * Shows all seeker accounts with:
 *   balance, total earned, games played, deposits count, account status
 *
 * Actions per player:
 *   Block / Unblock    — PATCH /api/admin/players { action: "block"|"unblock" }
 *   Adjust Balance     — PATCH /api/admin/players { action: "adjustBalance", amount }
 *   View Recent Error  — shows last session data (win/loss, score, wager)
 *
 * GET /api/admin/players?page=&q=&status=
 *
 * Frontend SOP §6.1: loading / empty / error / success.
 * DRY: CARD, Icon, authHeaders — defined once.
 * OOP: PlayerRow interface, typed state.
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import Badge        from "@/components/Badge";
import Button       from "@/components/Button";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useToast } from "@/components/Toast";
import { safeFetch, ApiError } from "@/lib/api";

function Icon({ path, className = "w-4 h-4" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path}/>
    </svg>
  );
}

function authHeaders(): HeadersInit {
  const tok = typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${tok}` };
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

interface PlayerRow {
  id: string; name: string; email: string;
  blocked: boolean; createdAt: string;
  balance: number; totalEarned: number;
  gamesPlayed: number; depositsCount: number;
}

export default function AdminPlayersPage() {
  const toast = useToast();
  const [players,       setPlayers]       = useState<PlayerRow[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState<"all"|"active"|"blocked">("all");
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  /* Adjust balance modal */
  const [adjustTarget, setAdjustTarget] = useState<PlayerRow | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustErr,    setAdjustErr]    = useState("");
  const adjustRef = useRef<HTMLInputElement>(null);

  /* ── Fetch ── */
  const fetchPlayers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), q: search, status: statusFilter });
      const data = await safeFetch<{ players: PlayerRow[]; pages: number }>(
        `/api/admin/players?${qs}`,
        { credentials: "include", headers: authHeaders() },
      );
      setPlayers(data.players ?? []);
      setTotalPages(data.pages ?? 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load players.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  /* ── Block / Unblock ── */
  const toggleBlock = useCallback(async (p: PlayerRow) => {
    const action = p.blocked ? "unblock" : "block";
    setActionLoading(prev => ({ ...prev, [p.id]: true }));
    try {
      await safeFetch("/api/admin/players", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ userId: p.id, action }),
      });
      setPlayers(prev => prev.map(x => x.id === p.id ? { ...x, blocked: !x.blocked } : x));
      toast.success(action === "block" ? `${p.name} blocked.` : `${p.name} unblocked.`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Action failed.");
    } finally {
      setActionLoading(prev => ({ ...prev, [p.id]: false }));
    }
  }, [toast]);

  /* ── Adjust balance ── */
  const openAdjust = (p: PlayerRow) => {
    setAdjustTarget(p); setAdjustAmount(""); setAdjustErr("");
    setTimeout(() => adjustRef.current?.focus(), 80);
  };

  const confirmAdjust = useCallback(async () => {
    if (!adjustTarget) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount === 0) { setAdjustErr("Enter a non-zero amount."); return; }

    setActionLoading(prev => ({ ...prev, [adjustTarget.id]: true }));
    try {
      const res = await safeFetch<{ newBalance: number }>("/api/admin/players", {
        method: "PATCH", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ userId: adjustTarget.id, action: "adjustBalance", amount }),
      });
      setPlayers(prev => prev.map(x => x.id === adjustTarget.id
        ? { ...x, balance: res.newBalance } : x));
      toast.success(`Balance updated to Rs. ${res.newBalance} for ${adjustTarget.name}.`);
      setAdjustTarget(null);
    } catch (e) {
      setAdjustErr(e instanceof ApiError ? e.message : "Adjustment failed.");
    } finally {
      setActionLoading(prev => ({ ...prev, [adjustTarget.id]: false }));
    }
  }, [adjustTarget, adjustAmount, toast]);

  /* ── Stats row ── */
  const totalBalance = players.reduce((s, p) => s + p.balance, 0);
  const blocked      = players.filter(p => p.blocked).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Players</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${players.length} shown · Total balance Rs. ${totalBalance.toLocaleString()} · ${blocked} blocked`}
          </p>
        </div>
        <Button variant="outline" size="sm" pill onClick={fetchPlayers}
          icon={<Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>}>
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)]"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => setError("")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] flex-shrink-0">
          {(["all","active","blocked"] as const).map(s => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={["px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold capitalize transition-all",
                statusFilter === s
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <label htmlFor="p-search" className="sr-only">Search players</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </div>
          <input id="p-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] transition-all"/>
        </div>
      </div>

      {/* Player list */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}</div>
      ) : !players.length ? (
        <div className={`${CARD} flex flex-col items-center gap-3 py-12 text-center`}>
          <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-8 h-8 text-[var(--text-muted)]"/>
          <p className="font-semibold text-[var(--text-primary)]">No players found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {players.map(p => (
            <div key={p.id} className={`${CARD} p-4`}>
              <div className="flex items-start gap-3 flex-wrap">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-500)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none">
                  {p.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{p.name}</p>
                    <Badge variant={p.blocked ? "error" : "success"} size="sm" dot>
                      {p.blocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{p.email}</p>

                  {/* Stats grid */}
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                    {[
                      { label: "Balance",  value: `Rs. ${p.balance.toLocaleString()}`,  color: "text-[var(--brand-400)]" },
                      { label: "Earned",   value: `Rs. ${p.totalEarned.toLocaleString()}`, color: "text-[var(--color-success)]" },
                      { label: "Games",    value: String(p.gamesPlayed),                  color: "text-[var(--text-primary)]" },
                      { label: "Deposits", value: String(p.depositsCount),                color: "text-[var(--text-primary)]" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{s.label}:</span>
                        <span className={`text-xs font-bold tabular-nums ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  <button type="button" disabled={actionLoading[p.id]}
                    onClick={() => openAdjust(p)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold bg-[color-mix(in_srgb,var(--brand-500)_10%,transparent)] text-[var(--brand-400)] border border-[color-mix(in_srgb,var(--brand-500)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand-500)_20%,transparent)] transition-colors disabled:opacity-40">
                    <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8"/>
                    Balance
                  </button>
                  <button type="button" disabled={actionLoading[p.id]}
                    onClick={() => toggleBlock(p)}
                    className={["flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold border transition-colors disabled:opacity-40",
                      p.blocked
                        ? "bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] text-[var(--color-success)] border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-success)_20%,transparent)]"
                        : "bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)] border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_16%,transparent)]",
                    ].join(" ")}>
                    <Icon path={p.blocked
                      ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"}/>
                    {actionLoading[p.id] ? "…" : p.blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" pill disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            icon={<Icon path="M15 19l-7-7 7-7"/>}>Prev</Button>
          <span className="text-sm text-[var(--text-muted)]">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" pill disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            iconRight={<Icon path="M9 5l7 7-7 7"/>}>Next</Button>
        </div>
      )}

      {/* ── Adjust balance modal ── */}
      {adjustTarget && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setAdjustTarget(null)}/>
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-sm"
            role="dialog" aria-modal="true" aria-label="Adjust balance">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <div>
                <h3 className="font-black text-[var(--text-primary)] text-lg">Adjust Balance</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {adjustTarget.name} · Current: <strong className="text-[var(--text-primary)]">Rs. {adjustTarget.balance}</strong>
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="adj-amt" className="text-sm font-medium text-[var(--text-primary)]">
                  Amount (positive = add, negative = deduct)
                </label>
                <input ref={adjustRef} id="adj-amt" type="number" value={adjustAmount}
                  onChange={e => { setAdjustAmount(e.target.value); setAdjustErr(""); }}
                  placeholder="e.g. 500 or -200"
                  className="w-full h-11 px-4 rounded-[var(--radius-md)] border bg-[var(--bg-elevated)] border-[var(--border-hover)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"/>
                {adjustErr && <p className="text-xs text-[var(--color-error)] font-medium">{adjustErr}</p>}
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setAdjustTarget(null)}>Cancel</Button>
                <Button variant="gradient" size="md" pill
                  loading={adjustTarget ? actionLoading[adjustTarget.id] : false}
                  onClick={confirmAdjust}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
