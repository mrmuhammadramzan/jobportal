"use client";
/**
 * /dashboard/wallet — Player wallet: balance, deposit form, deposit history.
 * Uses DepositModal (shared component) for deposit flow.
 * Data: GET /api/game/wallet
 *
 * DRY: Icon, authHeaders, StatusBadge defined once.
 * Frontend SOP §6.1: loading / empty / error / success all handled.
 */
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import DepositModal from "@/components/game/DepositModal";
import { useToast } from "@/components/Toast";
import { ROUTES } from "@/lib/routes";
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
  const map: Record<string, string> = {
    APPROVED: "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    REJECTED: "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]   text-[var(--color-error)]",
    PENDING:  "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-warning)]",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${map[status] ?? map.PENDING}`}>
      {status}
    </span>
  );
}

interface Deposit { id: string; amount: number; method: string; status: string; submittedAt: string; rejectionReason: string | null; }
interface WalletData { balance: number; deposits: Deposit[]; minDeposit: number; }

export default function WalletPage() {
  const toast = useToast();
  const [wallet,       setWallet]       = useState<WalletData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [depositOpen,  setDepositOpen]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await safeFetch<WalletData>("/api/game/wallet", {
        credentials: "include", headers: authHeaders(),
      });
      setWallet(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load wallet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-20 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)]"/>)}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">My Wallet</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Balance and deposit history</p>
        </div>
        <Button variant="gradient" size="sm" pill href={ROUTES.game}
          icon={<Icon path="M5 3l14 9-14 9V3z" className="w-4 h-4"/>}>
          Play Game
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] text-xs text-[var(--color-error)] font-medium flex items-center gap-2">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0"/>
          {error}
          <button className="ml-auto font-bold underline" onClick={load}>Retry</button>
        </div>
      )}

      {/* Balance card */}
      <div className="flex flex-col gap-4 p-6 rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]"
        style={{ boxShadow: "var(--shadow-brand)" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Available Balance</p>
        <p className="text-5xl font-black gradient-text tracking-tight">
          Rs. {wallet?.balance ?? 0}
        </p>
        <div className="flex gap-3 flex-wrap pt-2">
          <Button variant="gradient" size="md" pill onClick={() => setDepositOpen(true)}
            icon={<Icon path="M12 4v16m8-8H4" className="w-4 h-4"/>}>
            Deposit
          </Button>
          <Button variant="outline" size="md" pill href={ROUTES.seekerWithdraw}
            icon={<Icon path="M12 4v16m-4-4l4 4 4-4" className="w-4 h-4"/>}>
            Withdraw
          </Button>
        </div>
      </div>

      {/* Deposit history */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-widest">
            Deposit History
          </h3>
          <Link href={ROUTES.seekerHistory} className="text-xs font-semibold text-[var(--brand-400)] hover:underline">
            Full history →
          </Link>
        </div>

        {!wallet?.deposits.length ? (
          <div className="flex flex-col items-center gap-3 py-12 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-center">
            <Icon path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" className="w-8 h-8 text-[var(--text-muted)]"/>
            <p className="font-semibold text-[var(--text-primary)]">No deposits yet</p>
            <Button variant="gradient" size="sm" pill onClick={() => setDepositOpen(true)}>Make First Deposit</Button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
            {wallet.deposits.slice(0, 10).map(d => (
              <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.status === "APPROVED" ? "bg-[var(--color-success)]" : d.status === "REJECTED" ? "bg-[var(--color-error)]" : "bg-[var(--color-warning)]"}`}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Rs. {d.amount} via {d.method}</p>
                  {d.rejectionReason && <p className="text-xs text-[var(--color-error)] mt-0.5">{d.rejectionReason}</p>}
                  <p className="text-xs text-[var(--text-muted)]">{new Date(d.submittedAt).toLocaleDateString("en-PK")}</p>
                </div>
                <StatusBadge status={d.status}/>
              </div>
            ))}
          </div>
        )}
      </div>

      {depositOpen && wallet && (
        <DepositModal
          minDeposit={wallet.minDeposit}
          onClose={() => setDepositOpen(false)}
          onSuccess={() => { setDepositOpen(false); load(); }}
        />
      )}
    </div>
  );
}
