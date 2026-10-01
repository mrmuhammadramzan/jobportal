"use client";
/**
 * /admin/game-settings — HUNT game configuration.
 *
 * Sections:
 *   1. Flight Range  — escapeMin / escapeMax (bird escapes between these multipliers)
 *   2. Wager Limits  — minWager / maxWager / minDeposit
 *   3. Outcome Bias  — biasMode: none | win | loss
 *
 * Wired to:
 *   GET /api/admin/game-settings — load on mount
 *   PUT /api/admin/game-settings — save each section independently
 *
 * OOP: SettingsSection<T> encapsulates load/save/state for each card (DRY).
 * All values env-backed on the API side — no hardcoded values here.
 * UI/UX SOP §Hard Rule 3: CSS var tokens only, no hardcoded colours.
 * Backend SOP Hard Rule 1: requireAdmin enforced server-side.
 */
import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";

/* ══ Types ══════════════════════════════════════════════════════════════ */
interface GameSettings {
  escapeMin:   number;
  escapeMax:   number;
  minWager:    number;
  maxWager:    number;
  minDeposit:  number;
  minWithdraw: number;
  biasMode:    "none" | "win" | "loss";
}

type SaveState = "idle" | "saving" | "saved" | "error";

/* ══ Constants ══════════════════════════════════════════════════════════ */
const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden";

const BIAS_OPTIONS: { value: "none" | "win" | "loss"; label: string; desc: string; color: string }[] = [
  { value: "none", label: "Random",   desc: "Outcomes are fully random — house edge only from math.", color: "var(--brand-500)" },
  { value: "win",  label: "Favour Win", desc: "Bird stays longer — players cash out more often.",      color: "var(--color-success)" },
  { value: "loss", label: "Favour Loss", desc: "Bird escapes early — house wins more rounds.",          color: "var(--color-error)" },
];

/* ══ Helpers ════════════════════════════════════════════════════════════ */
function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

function Icon({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"><path d={d} /></svg>
  );
}

function NumInput({
  id, label, helperText, value, min, max, step = 1, prefix, suffix,
  onChange, error,
}: {
  id: string; label: string; helperText?: string;
  value: number; min: number; max: number; step?: number;
  prefix?: string; suffix?: string;
  onChange: (n: number) => void; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm font-semibold text-[var(--text-muted)] pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          id={id} type="number" min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || min)}
          className={[
            "w-full h-10 rounded-[var(--radius-md)] border text-sm text-[var(--text-primary)]",
            "bg-[var(--bg-elevated)] outline-none transition-all",
            "focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
            "hover:border-[var(--border-hover)]",
            prefix ? "pl-10 pr-3" : suffix ? "pl-3 pr-8" : "px-3",
            error ? "border-[var(--color-error)]" : "border-[var(--border-default)]",
          ].join(" ")}
        />
        {suffix && (
          <span className="absolute right-3 text-sm font-semibold text-[var(--text-muted)] pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs font-medium text-[var(--color-error)]">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
      )}
    </div>
  );
}

function SaveRow({ state, onSave, label }: { state: SaveState; onSave: () => void; label: string }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-default)]">
      {state === "saved" && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
          <Icon d="M20 6L9 17l-5-5" className="w-3.5 h-3.5" /> Saved
        </span>
      )}
      {state === "error" && (
        <span className="text-xs font-medium text-[var(--color-error)]">Save failed — try again</span>
      )}
      <Button variant="gradient" size="md" pill loading={state === "saving"} onClick={onSave}>
        {label}
      </Button>
    </div>
  );
}

/* ══ Page ═══════════════════════════════════════════════════════════════ */
export default function GameSettingsPage() {
  const [settings,  setSettings]  = useState<GameSettings | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  /* Per-section draft state */
  const [flight, setFlight] = useState({ escapeMin: 1.1, escapeMax: 12 });
  const [wager,  setWager]  = useState({ minWager: 120, maxWager: 10000, minDeposit: 120, minWithdraw: 200 });
  const [bias,   setBias]   = useState<"none" | "win" | "loss">("none");

  /* Per-section save state */
  const [flightSave, setFlightSave] = useState<SaveState>("idle");
  const [wagerSave,  setWagerSave]  = useState<SaveState>("idle");
  const [biasSave,   setBiasSave]   = useState<SaveState>("idle");

  /* Per-section validation errors */
  const [flightErr, setFlightErr] = useState({ escapeMin: "", escapeMax: "" });
  const [wagerErr,  setWagerErr]  = useState({ minWager: "", maxWager: "", minDeposit: "", minWithdraw: "" });

  /* ── Load on mount ── */
  useEffect(() => {
    fetch("/api/admin/game-settings", { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load game settings")))
      .then((d: GameSettings) => {
        setSettings(d);
        setFlight({ escapeMin: d.escapeMin, escapeMax: d.escapeMax });
        setWager({ minWager: d.minWager, maxWager: d.maxWager, minDeposit: d.minDeposit, minWithdraw: d.minWithdraw });
        setBias(d.biasMode);
      })
      .catch((e: Error) => setLoadError(e.message ?? "Failed to load game settings."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Generic save helper — DRY ── */
  const save = useCallback(async (
    payload: Partial<GameSettings>,
    setSaveState: (s: SaveState) => void,
  ) => {
    setSaveState("saving");
    try {
      const res  = await fetch("/api/admin/game-settings", {
        method: "PUT", headers: authHeaders(), credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setSettings(prev => prev ? { ...prev, ...payload } : prev);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);

      /* ── Notify all open game tabs to re-fetch wallet/config immediately ──
         BroadcastChannel is same-origin only — no cross-site risk.
         The player page listens for this event and calls fetchWallet() instantly,
         so stake presets and deposit limits reflect the new settings without
         waiting for the 30-second poll cycle.                                  */
      try {
        const ch = new BroadcastChannel("hunt:settings");
        ch.postMessage({ type: "game-settings-updated", payload });
        ch.close();
      } catch { /* BroadcastChannel not supported (e.g. some embedded WebViews) */ }

    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  }, []);

  /* ── Section savers with validation ── */
  const saveFlight = useCallback(() => {
    const errs = { escapeMin: "", escapeMax: "" };
    if (flight.escapeMin < 1.0 || flight.escapeMin > 99)
      errs.escapeMin = "Must be between 1.0× and 99×.";
    if (flight.escapeMax <= flight.escapeMin)
      errs.escapeMax = `Must be greater than minimum (${flight.escapeMin}×).`;
    if (flight.escapeMax > 100)
      errs.escapeMax = "Cannot exceed 100×.";
    setFlightErr(errs);
    if (errs.escapeMin || errs.escapeMax) return;
    save({ escapeMin: flight.escapeMin, escapeMax: flight.escapeMax }, setFlightSave);
  }, [flight, save]);

  const saveWager = useCallback(() => {
    const errs = { minWager: "", maxWager: "", minDeposit: "", minWithdraw: "" };
    if (wager.minWager < 1)      errs.minWager    = "Must be at least Rs. 1.";
    if (wager.maxWager <= wager.minWager)
      errs.maxWager = `Must be greater than min wager (Rs. ${wager.minWager}).`;
    if (wager.minDeposit < 1)    errs.minDeposit  = "Must be at least Rs. 1.";
    if (wager.minWithdraw < 1)   errs.minWithdraw = "Must be at least Rs. 1.";
    setWagerErr(errs);
    if (errs.minWager || errs.maxWager || errs.minDeposit || errs.minWithdraw) return;
    save({
      minWager:    wager.minWager,
      maxWager:    wager.maxWager,
      minDeposit:  wager.minDeposit,
      minWithdraw: wager.minWithdraw,
    }, setWagerSave);
  }, [wager, save]);

  const saveBias = useCallback(() => {
    save({ biasMode: bias }, setBiasSave);
  }, [bias, save]);

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-52 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]" />
      {[1, 2, 3].map(i => (
        <div key={i} className={`${CARD} h-56`} />
      ))}
    </div>
  );

  if (loadError) return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Icon d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-9 h-9 text-[var(--color-error)]" />
      <p className="font-semibold text-[var(--text-primary)]">{loadError}</p>
      <Button variant="outline" size="md" pill onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Page header */}
      <div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Game Settings</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">
          Control HUNT flight range, wager limits, and outcome behaviour. Changes apply immediately to new game sessions.
        </p>
      </div>

      {/* ── Section 1: Flight Range ───────────────────────────────────── */}
      <div className={CARD}>
        <div className="flex items-start gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb,var(--brand-500) 12%,transparent)", color: "var(--brand-400)" }}>
            <Icon d="M5 3l14 9-14 9V3z" className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Flight Range</p>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">
              The multiplier window the bird flies in. A round ends when the multiplier
              hits a random value between <strong className="text-[var(--text-primary)]">min</strong> and{" "}
              <strong className="text-[var(--text-primary)]">max</strong>.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Visual range bar */}
          <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)]"
            style={{ background: "color-mix(in srgb,var(--brand-500) 6%,transparent)", border: "1px solid color-mix(in srgb,var(--brand-500) 15%,transparent)" }}>
            <div className="flex-1 h-3 rounded-full bg-[var(--bg-elevated)] relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 rounded-full transition-all duration-300"
                style={{
                  left:  `${Math.max(0, ((flight.escapeMin - 1) / 99) * 100)}%`,
                  right: `${Math.max(0, ((100 - flight.escapeMax) / 99) * 100)}%`,
                  background: "linear-gradient(90deg, var(--brand-500), var(--brand-400))",
                }}
              />
            </div>
            <span className="text-xs font-black tabular-nums text-[var(--brand-400)] whitespace-nowrap">
              {flight.escapeMin.toFixed(2)}× → {flight.escapeMax.toFixed(2)}×
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumInput
              id="escape-min" label="Minimum Multiplier"
              value={flight.escapeMin} min={1.0} max={99} step={0.1} suffix="×"
              helperText="Earliest the bird can escape (floor)."
              error={flightErr.escapeMin}
              onChange={v => { setFlight(p => ({ ...p, escapeMin: v })); setFlightErr(p => ({ ...p, escapeMin: "" })); }}
            />
            <NumInput
              id="escape-max" label="Maximum Multiplier"
              value={flight.escapeMax} min={1.1} max={100} step={0.5} suffix="×"
              helperText="Latest the bird can escape (ceiling)."
              error={flightErr.escapeMax}
              onChange={v => { setFlight(p => ({ ...p, escapeMax: v })); setFlightErr(p => ({ ...p, escapeMax: "" })); }}
            />
          </div>

          {/* Live preview */}
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5 flex-shrink-0 text-[var(--brand-400)]" />
            Each round picks a random escape point between{" "}
            <strong className="text-[var(--text-primary)]">{flight.escapeMin.toFixed(2)}×</strong> and{" "}
            <strong className="text-[var(--text-primary)]">{flight.escapeMax.toFixed(2)}×</strong>.
            A player must press SECURE before that point to win.
          </div>

          <SaveRow state={flightSave} onSave={saveFlight} label="Save Flight Range" />
        </div>
      </div>

      {/* ── Section 2: Wager Limits ───────────────────────────────────── */}
      <div className={CARD}>
        <div className="flex items-start gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb,var(--color-warning) 12%,transparent)", color: "var(--color-warning)" }}>
            <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Wager Limits</p>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">
              Set the minimum and maximum amount players can bet per round, and the minimum deposit to add game balance.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NumInput
              id="min-deposit" label="Min Deposit (PKR)"
              value={wager.minDeposit} min={1} max={1000000} step={10} prefix="Rs."
              helperText="Minimum to add game balance."
              error={wagerErr.minDeposit}
              onChange={v => { setWager(p => ({ ...p, minDeposit: Math.round(v) })); setWagerErr(p => ({ ...p, minDeposit: "" })); }}
            />
            <NumInput
              id="min-wager" label="Min Wager (PKR)"
              value={wager.minWager} min={1} max={1000000} step={10} prefix="Rs."
              helperText="Smallest bet a player can place."
              error={wagerErr.minWager}
              onChange={v => { setWager(p => ({ ...p, minWager: Math.round(v) })); setWagerErr(p => ({ ...p, minWager: "" })); }}
            />
            <NumInput
              id="max-wager" label="Max Wager (PKR)"
              value={wager.maxWager} min={1} max={10000000} step={100} prefix="Rs."
              helperText="Largest bet a player can place."
              error={wagerErr.maxWager}
              onChange={v => { setWager(p => ({ ...p, maxWager: Math.round(v) })); setWagerErr(p => ({ ...p, maxWager: "" })); }}
            />
            <NumInput
              id="min-withdraw" label="Min Withdrawal (PKR)"
              value={wager.minWithdraw} min={1} max={1000000} step={10} prefix="Rs."
              helperText="Smallest amount a player can withdraw."
              error={wagerErr.minWithdraw}
              onChange={v => { setWager(p => ({ ...p, minWithdraw: Math.round(v) })); setWagerErr(p => ({ ...p, minWithdraw: "" })); }}
            />
          </div>

          {/* Live summary */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Deposit from",  value: `Rs. ${wager.minDeposit.toLocaleString()}` },
              { label: "Wager window",  value: `Rs. ${wager.minWager.toLocaleString()} – Rs. ${wager.maxWager.toLocaleString()}` },
              { label: "Min withdraw",  value: `Rs. ${wager.minWithdraw.toLocaleString()}` },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "color-mix(in srgb,var(--color-warning) 8%,transparent)", border: "1px solid color-mix(in srgb,var(--color-warning) 20%,transparent)", color: "var(--color-warning)" }}>
                <span className="text-[var(--text-muted)] font-normal">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <SaveRow state={wagerSave} onSave={saveWager} label="Save Wager Limits" />
        </div>
      </div>

      {/* ── Section 3: Outcome Bias ───────────────────────────────────── */}
      <div className={CARD}>
        <div className="flex items-start gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "color-mix(in srgb,var(--color-error) 10%,transparent)", color: "var(--color-error)" }}>
            <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Outcome Bias</p>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">
              Override the random distribution for all players. Individually blocked players always get Loss regardless.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Outcome bias">
            {BIAS_OPTIONS.map(opt => {
              const active = bias === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setBias(opt.value)}
                  className="flex flex-col gap-2 p-4 rounded-[var(--radius-lg)] border text-left transition-all"
                  style={{
                    background: active ? `color-mix(in srgb,${opt.color} 10%,transparent)` : "var(--bg-surface)",
                    borderColor: active ? `color-mix(in srgb,${opt.color} 40%,transparent)` : "var(--border-default)",
                    outline: active ? `2px solid color-mix(in srgb,${opt.color} 30%,transparent)` : "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold"
                      style={{ color: active ? opt.color : "var(--text-primary)" }}>
                      {opt.label}
                    </span>
                    {active && (
                      <span style={{ color: opt.color }}>
                        <Icon d="M20 6L9 17l-5-5" className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-muted)]">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {bias !== "none" && (
            <div className="flex items-start gap-2 p-3 rounded-[var(--radius-lg)]"
              style={{ background: "color-mix(in srgb,var(--color-warning) 8%,transparent)", border: "1px solid color-mix(in srgb,var(--color-warning) 20%,transparent)" }}>
              <Icon d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-warning)]" />
              <p className="text-xs text-[var(--text-secondary)]">
                <strong className="text-[var(--color-warning)]">Bias active.</strong>{" "}
                {bias === "win"
                  ? "Players will win more often — monitor withdrawals closely."
                  : "Players will lose more often — may reduce engagement if overused."}
              </p>
            </div>
          )}

          <SaveRow state={biasSave} onSave={saveBias} label="Save Bias" />
        </div>
      </div>

      {/* Current live config read-only summary */}
      {settings && (
        <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)]"
          style={{ background: "color-mix(in srgb,var(--brand-500) 6%,transparent)", border: "1px solid color-mix(in srgb,var(--brand-500) 15%,transparent)" }}>
          <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--brand-400)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Currently Live</p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Flight: <strong className="text-[var(--text-secondary)]">{settings.escapeMin}× – {settings.escapeMax}×</strong>
              {" · "}Wager: <strong className="text-[var(--text-secondary)]">Rs. {settings.minWager.toLocaleString()} – Rs. {settings.maxWager.toLocaleString()}</strong>
              {" · "}Min Withdraw: <strong className="text-[var(--text-secondary)]">Rs. {settings.minWithdraw.toLocaleString()}</strong>
              {" · "}Bias: <strong className="text-[var(--text-secondary)]">{settings.biasMode}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
