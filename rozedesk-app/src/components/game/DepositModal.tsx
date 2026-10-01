"use client";
/**
 * DepositModal — shared game deposit overlay.
 *
 * Displays active payment account details (phone, name) fetched from
 * /api/payment-settings so the user knows exactly where to send money,
 * then collects a screenshot proof before submitting to /api/game/deposit.
 *
 * Props:
 *   minDeposit — minimum allowed deposit amount (Rs.)
 *   onClose    — close without action
 *   onSuccess  — called after successful API submission (modal stays open
 *                in "submitted" state; parent should close after this fires)
 *
 * DRY: imported by game/page.tsx and dashboard/wallet/page.tsx — never duplicated.
 */
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/Toast";
import { safeFetch, ApiError } from "@/lib/api";

/* ── Types ──────────────────────────────────────────────── */
interface PaymentAccount { method: string; phone: string; name: string; address?: string | null; }

/* ── Helpers ─────────────────────────────────────────────── */
function tok() {
  return typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
}
function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${tok()}` };
}

/* ── Micro icon (inline SVG, no emoji) ───────────────────── */
function Icon({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   DEPOSIT MODAL
   ══════════════════════════════════════════════════════════ */
export interface DepositModalProps {
  minDeposit: number;
  onClose:    () => void;
  onSuccess:  () => void;
}

export default function DepositModal({ minDeposit, onClose, onSuccess }: DepositModalProps) {
  const toast = useToast();

  const [amount,   setAmount]   = useState(String(minDeposit));
  const [method,   setMethod]   = useState<"JAZZCASH" | "EASYPAISA">("JAZZCASH");
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [busy,     setBusy]     = useState(false);
  const [done,     setDone]     = useState(false);
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [acctErr,  setAcctErr]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Fetch active payment accounts (which method is live + phone number) */
  useEffect(() => {
    fetch("/api/payment-settings")
      .then(r => r.ok ? r.json() : [])
      .then((data: PaymentAccount[]) => setAccounts(Array.isArray(data) ? data : []))
      .catch(() => setAcctErr(true));
  }, []);

  /** Currently selected payment account (null if admin hasn't configured it) */
  const activeAccount = accounts.find(a => a.method.toUpperCase() === method) ?? null;

  const submit = async () => {
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt < minDeposit) {
      toast.error(`Minimum deposit is Rs. ${minDeposit}.`);
      return;
    }
    if (!file) {
      toast.error("Please attach a payment screenshot.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("amount",     String(amt));
      fd.append("method",     method);
      fd.append("screenshot", file);
      await safeFetch("/api/game/deposit", {
        method: "POST", credentials: "include",
        headers: authHeaders(), body: fd,
      });
      setDone(true);
      toast.success("Deposit submitted! Admin will review shortly.");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  /* ── Styles (no hardcoded colours — use rgba/variable tokens only) ── */
  const S = {
    overlay:  "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm",
    card:     "relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl",
    cardBg:   { background: "rgba(13,17,32,0.98)", border: "1px solid rgba(255,255,255,0.08)" } as React.CSSProperties,
    header:   { borderBottom: "1px solid rgba(255,255,255,0.06)" } as React.CSSProperties,
    closeBtn: { background: "rgba(255,255,255,0.07)", color: "rgba(200,215,255,0.5)" } as React.CSSProperties,
    label:    { color: "rgba(200,215,255,0.45)" } as React.CSSProperties,
    input:    { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" } as React.CSSProperties,
    muted:    { color: "rgba(200,215,255,0.5)" } as React.CSSProperties,
    acctBox:  { background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" } as React.CSSProperties,
    dropzone: (hasPreview: boolean) => ({
      borderColor: hasPreview ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.09)",
    }) as React.CSSProperties,
    submitBtn: { background: "linear-gradient(135deg,#fbbf24,#f97316)" } as React.CSSProperties,
    doneBtn:   { background: "linear-gradient(135deg,#fbbf24,#f97316)" } as React.CSSProperties,
  };

  return (
    <div className={S.overlay} role="dialog" aria-modal="true" aria-label="Deposit funds">
      <div className={S.card} style={S.cardBg}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4" style={S.header}>
          <div>
            <p className="font-bold text-white">Add Game Balance</p>
            <p className="text-xs mt-0.5" style={S.muted}>Min Rs. {minDeposit}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={S.closeBtn}>
            <Icon d="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
          </button>
        </div>

        {/* ── Done state ── */}
        {done ? (
          <div className="flex flex-col items-center gap-4 py-12 px-5 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.12)" }}>
              <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                className="w-7 h-7 text-green-400" />
            </div>
            <p className="font-bold text-white text-lg">Submitted!</p>
            <p className="text-sm" style={S.muted}>
              Admin will review and credit your balance shortly.
            </p>
            <button type="button" onClick={onClose}
              className="px-6 py-2 rounded-full font-bold text-sm text-black"
              style={S.doneBtn}>
              Done
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <div className="flex flex-col gap-4 px-5 py-5">

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={S.label}>
                Amount (PKR)
              </label>
              <input
                type="number" min={minDeposit} value={amount}
                onChange={e => setAmount(e.target.value)}
                className="h-11 px-4 rounded-xl text-white text-sm outline-none"
                style={S.input}
              />
            </div>

            {/* Payment method toggle */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={S.label}>
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["JAZZCASH", "EASYPAISA"] as const).map(m => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: method === m ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${method === m ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: method === m ? "#fbbf24" : "rgba(200,215,255,0.55)",
                    }}>
                    {m === "JAZZCASH" ? "JazzCash" : "Easypaisa"}
                  </button>
                ))}
              </div>
            </div>

            {/* Active wallet account — shown when admin has configured the method */}
            {acctErr && (
              <p className="text-xs text-center" style={{ color: "rgba(239,68,68,0.7)" }}>
                Could not load payment details. Check with admin.
              </p>
            )}
            {!acctErr && activeAccount && (
              <div className="p-3 rounded-xl" style={S.acctBox}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1.5">
                  Send to
                </p>
                {/* Phone — copyable */}
                <button type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeAccount.phone).catch(() => {});
                    toast.success("Number copied!");
                  }}
                  className="text-xl font-black text-white hover:text-yellow-400 transition-colors tabular-nums text-left"
                  aria-label={`Copy phone number ${activeAccount.phone}`}>
                  {activeAccount.phone}
                </button>
                <p className="text-sm mt-0.5" style={S.muted}>{activeAccount.name}</p>
                {activeAccount.address && (
                  <p className="text-xs mt-0.5" style={{ color: "rgba(200,215,255,0.35)" }}>
                    {activeAccount.address}
                  </p>
                )}
              </div>
            )}
            {!acctErr && !activeAccount && accounts.length > 0 && (
              <p className="text-xs text-center" style={{ color: "rgba(200,215,255,0.35)" }}>
                {method === "JAZZCASH" ? "JazzCash" : "Easypaisa"} is not yet configured. Try the other method.
              </p>
            )}

            {/* Screenshot upload */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={S.label}>
                Screenshot (proof of payment)
              </p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="py-5 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all"
                style={S.dropzone(!!preview)}>
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Payment screenshot preview"
                    className="max-h-28 rounded-lg object-contain" />
                ) : (
                  <>
                    <span style={{ color: "rgba(200,215,255,0.25)" }}>
                      <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        className="w-6 h-6" />
                    </span>
                    <p className="text-sm" style={{ color: "rgba(200,215,255,0.35)" }}>
                      Tap to upload payment screenshot
                    </p>
                  </>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only"
                aria-label="Upload screenshot"
                onChange={e => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  if (f) setPreview(URL.createObjectURL(f));
                }} />
            </div>

            {/* Submit */}
            <button type="button" disabled={busy} onClick={submit}
              className="w-full h-12 rounded-xl font-black text-sm text-black disabled:opacity-50 transition-opacity"
              style={S.submitBtn}>
              {busy ? "Submitting…" : "Submit Deposit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
