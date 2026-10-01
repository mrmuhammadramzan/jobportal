"use client";
/**
 * /dashboard/withdraw — Player withdrawal request form.
 * POST /api/game/withdraw
 *
 * OOP: WithdrawForm uses local state machine (idle → submitting → done → idle).
 * Frontend SOP §6.1: all states handled with clear feedback.
 * Security: amount validated client+server, account number not logged.
 */
import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";
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

const FIELD = "w-full h-11 px-4 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-hover)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/25 transition-all placeholder:text-[var(--text-muted)]";
const METHODS = [
  { value: "JAZZCASH",  label: "JazzCash"  },
  { value: "EASYPAISA", label: "Easypaisa" },
] as const;

export default function WithdrawPage() {
  const toast = useToast();
  const [balance,     setBalance]     = useState(0);
  const [minWithdraw, setMinWithdraw] = useState(200);   /* default matches GAME.MIN_WITHDRAW */
  const [amount,    setAmount]    = useState("");
  const [method,    setMethod]    = useState<"JAZZCASH"|"EASYPAISA">("JAZZCASH");
  const [accNumber, setAccNumber] = useState("");
  const [accName,   setAccName]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  /* Load current balance */
  const loadBalance = useCallback(async () => {
    try {
      const data = await safeFetch<{ balance: number; minWithdraw: number }>("/api/game/wallet", {
        credentials: "include", headers: authHeaders(),
      });
      setBalance(data.balance);
      setMinWithdraw(data.minWithdraw);
    } catch { /* non-fatal */ }
  }, []);
  useEffect(() => { loadBalance(); }, [loadBalance]);

  const submit = async () => {
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt < minWithdraw) { toast.error(`Minimum withdrawal is Rs. ${minWithdraw}.`); return; }
    if (amt > balance)                { toast.error("Amount exceeds your balance."); return; }
    if (!accNumber.trim())            { toast.error("Account number is required."); return; }
    if (!accName.trim())              { toast.error("Account name is required."); return; }

    setLoading(true);
    try {
      await safeFetch("/api/game/withdraw", {
        method: "POST", credentials: "include", headers: authHeaders(),
        body: JSON.stringify({ amount: amt, method, accountNumber: accNumber.trim(), accountName: accName.trim() }),
      });
      setDone(true);
      toast.success("Withdrawal request submitted! Admin will process it shortly.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] flex items-center justify-center">
        <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-success)]"/>
      </div>
      <div>
        <p className="text-2xl font-black text-[var(--text-primary)]">Request Submitted</p>
        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Your withdrawal is pending admin approval. You&apos;ll be notified when it&apos;s processed.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="md" pill href={ROUTES.seekerHistory}>View History</Button>
        <Button variant="gradient" size="md" pill onClick={() => { setDone(false); setAmount(""); setAccNumber(""); setAccName(""); }}>
          New Request
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Withdraw Funds</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">
          Available balance: <span className="font-bold text-[var(--brand-500)]">Rs. {balance}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-amount" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            Amount (PKR)
          </label>
          <input id="w-amount" type="number" min={minWithdraw} max={balance} value={amount}
            onChange={e => setAmount(e.target.value)} className={FIELD}
            placeholder={`Min Rs. ${minWithdraw}`}/>
          <p className="text-xs text-[var(--text-muted)]">Min Rs. {minWithdraw} · Max Rs. {balance}</p>
        </div>

        {/* Method */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Payment Method</p>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map(m => (
              <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                className={["flex items-center justify-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] border text-sm font-semibold transition-all",
                  method === m.value
                    ? "border-[var(--brand-500)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] text-[var(--brand-400)]"
                    : "border-[var(--border-hover)] text-[var(--text-secondary)] hover:border-[var(--brand-500)] hover:text-[var(--text-primary)]",
                ].join(" ")}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Account number */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-acc" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            Account Number
          </label>
          <input id="w-acc" type="text" value={accNumber} onChange={e => setAccNumber(e.target.value)}
            className={FIELD} placeholder="03XX-XXXXXXX"/>
        </div>

        {/* Account name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-name" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            Account Holder Name
          </label>
          <input id="w-name" type="text" value={accName} onChange={e => setAccName(e.target.value)}
            className={FIELD} placeholder="Full name on the account"/>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)]">
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5"/>
          <p className="text-xs text-[var(--text-secondary)]">
            Double-check your account number. Incorrect details may cause payment failures.
            Your balance is deducted only after admin approval.
          </p>
        </div>

        <Button variant="gradient" size="lg" pill fullWidth loading={loading} onClick={submit}
          icon={<Icon path="M12 4v16m-4-4l4 4 4-4" className="w-5 h-5"/>}>
          Submit Withdrawal
        </Button>
      </div>
    </div>
  );
}
