"use client";
/**
 * /admin/payment-settings — Configure JazzCash and Easypaisa receiving details.
 *
 * Wired to:
 *   GET  /api/admin/payment-settings  — load on mount
 *   POST /api/admin/payment-settings  — save / toggle each method
 *
 * Frontend SOP §6.1: loading / empty / populated / error states.
 * Frontend SOP §7:   visible labels, required fields marked.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * UI/UX SOP §Hard Rule 5: disabling a method requires confirmation.
 * Backend SOP §7: every fetch has error handling and feedback.
 * DRY: authFetch(), update(), CARD — each defined once.
 */
import React, { useState, useEffect, useCallback } from "react";
import Button    from "@/components/Button";
import FormInput from "@/components/FormInput";
import Badge     from "@/components/Badge";
import { PAYMENT_METHODS, type PaymentMethodKey } from "@/lib/constants";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

/** Auth headers — DRY, avoids inline repetition */
function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization:  `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

interface MethodConfig {
  active:  boolean;
  phone:   string;
  name:    string;
  address: string;
}

type MethodsState = Record<PaymentMethodKey, MethodConfig>;
type SaveState    = "idle" | "saving" | "saved" | "error";

const EMPTY: MethodConfig = { active: false, phone: "", name: "", address: "" };

export default function PaymentSettingsPage() {
  const [methods,       setMethods]       = useState<MethodsState>({ jazzcash: EMPTY, easypaisa: EMPTY });
  const [saveState,     setSaveState]     = useState<Record<PaymentMethodKey, SaveState>>({ jazzcash: "idle", easypaisa: "idle" });
  const [saveError,     setSaveError]     = useState<Record<PaymentMethodKey, string>>({ jazzcash: "", easypaisa: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<PaymentMethodKey | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [loadError,     setLoadError]     = useState("");

  /* ── Application fee state — loaded from DB on mount ── */
  const [appFee,        setAppFee]        = useState<number>(0);
  const [feeSaving,     setFeeSaving]     = useState(false);
  const [feeSaved,      setFeeSaved]      = useState(false);
  const [feeError,      setFeeError]      = useState("");

  /* ── Platform cut state ── */
  const [platformCut,   setPlatformCut]   = useState<number>(0);
  const [cutSaving,     setCutSaving]     = useState(false);
  const [cutSaved,      setCutSaved]      = useState(false);
  const [cutError,      setCutError]      = useState("");

  /* ── Load settings on mount ── */
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/payment-settings", { headers: authHeaders(), credentials: "include" })
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load payment settings"))),
      fetch("/api/fee").then(r => r.ok ? r.json() : { fee: 0 }),
    ])
      .then(([rows, feeData]: [{ method: string; phone: string; name: string; address: string | null; active: boolean }[], { fee: number }]) => {
        const next = { jazzcash: { ...EMPTY }, easypaisa: { ...EMPTY } };
        rows.forEach(row => {
          const key = row.method.toLowerCase() as PaymentMethodKey;
          if (key === "jazzcash" || key === "easypaisa") {
            next[key] = { active: row.active, phone: row.phone, name: row.name, address: row.address ?? "" };
          }
        });
        setMethods(next);
        setAppFee(feeData.fee ?? 0);
      })
      .catch(e => setLoadError(e.message ?? "Failed to load payment settings."))
      .finally(() => setLoading(false));

    /* Load platform cut from settings */
    fetch("/api/admin/settings", { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.platform?.platformCut !== undefined) setPlatformCut(d.platform.platformCut); })
      .catch(() => {});
  }, []);

  /** Update a field in local state — instant feedback */
  function update(method: PaymentMethodKey, field: keyof MethodConfig, value: string | boolean) {
    setMethods(prev => ({ ...prev, [method]: { ...prev[method], [field]: value } }));
  }

  /** Save a method to the API */
  const save = useCallback(async (method: PaymentMethodKey) => {
    const cfg = methods[method];
    if (!cfg.phone.trim()) { setSaveError(p => ({ ...p, [method]: "Phone / Till ID is required." })); return; }
    if (!cfg.name.trim())  { setSaveError(p => ({ ...p, [method]: "Account name is required."   })); return; }

    setSaveState(p => ({ ...p, [method]: "saving" }));
    setSaveError(p => ({ ...p, [method]: "" }));

    try {
      const res  = await fetch("/api/admin/payment-settings", {
        method: "POST", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({
          method:  method === "jazzcash" ? "JazzCash" : "Easypaisa",
          phone:   cfg.phone,
          name:    cfg.name,
          address: cfg.address,
          active:  cfg.active,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setSaveState(p => ({ ...p, [method]: "saved" }));
      setTimeout(() => setSaveState(p => ({ ...p, [method]: "idle" })), 2500);
    } catch (e: unknown) {
      setSaveState(p => ({ ...p, [method]: "error" }));
      setSaveError(p => ({ ...p, [method]: e instanceof Error ? e.message : "Save failed." }));
    }
  }, [methods]);

  /** Toggle enable — disable needs confirmation */
  function handleToggle(method: PaymentMethodKey, on: boolean) {
    if (!on) {
      setDeleteConfirm(method); // show confirmation before disabling
    } else {
      update(method, "active", true);
      /* Immediately persist the active=true toggle */
      const cfg = methods[method];
      fetch("/api/admin/payment-settings", {
        method: "POST", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({
          method:  method === "jazzcash" ? "JazzCash" : "Easypaisa",
          phone:   cfg.phone, name: cfg.name, address: cfg.address, active: true,
        }),
      }).catch(console.error);
    }
  }

  function confirmDisable(method: PaymentMethodKey) {
    update(method, "active", false);
    setDeleteConfirm(null);
    /* Persist active=false immediately */
    const cfg = methods[method];
    fetch("/api/admin/payment-settings", {
      method: "POST", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({
        method:  method === "jazzcash" ? "JazzCash" : "Easypaisa",
        phone:   cfg.phone, name: cfg.name, address: cfg.address, active: false,
      }),
    }).catch(console.error);
  }

  /** Save application fee to platform_settings via /api/admin/settings */
  async function saveFee() {
    const fee = Number(appFee);
    if (!fee || fee < 1 || isNaN(fee)) { setFeeError("Fee must be a positive number."); return; }
    setFeeSaving(true); setFeeError(""); setFeeSaved(false);
    try {
      const res  = await fetch("/api/admin/settings", {
        method: "PUT", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({ appFee: fee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setFeeSaved(true);
      setTimeout(() => setFeeSaved(false), 2500);
    } catch (e: unknown) {
      setFeeError(e instanceof Error ? e.message : "Failed to save fee.");
    } finally {
      setFeeSaving(false);
    }
  }

  /** Save platform cut percentage */
  async function savePlatformCut() {
    const pct = Number(platformCut);
    if (isNaN(pct) || pct < 0 || pct > 99) { setCutError("Cut must be 0–99%."); return; }
    setCutSaving(true); setCutError(""); setCutSaved(false);
    try {
      const res  = await fetch("/api/admin/settings", {
        method: "PUT", headers: authHeaders(), credentials: "include",
        body: JSON.stringify({ platformCut: pct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setCutSaved(true);
      setTimeout(() => setCutSaved(false), 2500);
    } catch (e: unknown) {
      setCutError(e instanceof Error ? e.message : "Failed to save cut.");
    } finally {
      setCutSaving(false);
    }
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-[var(--bg-elevated)] rounded animate-pulse" />
        {[1, 2].map(i => (
          <div key={i} className={`${CARD} h-64 animate-pulse`} />
        ))}
      </div>
    );
  }

  /* ── Load error ── */
  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-error)]" />
        <p className="font-semibold text-[var(--text-primary)]">{loadError}</p>
        <Button variant="outline" size="md" pill onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Payment Settings</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">
          Applicants pay{" "}
          <span className="font-semibold text-[var(--text-primary)]">PKR {appFee}</span>
          {" "}per application. Configure where they send the payment below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: config cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Application Fee Card */}
          <div className={`${CARD} overflow-hidden`}>
            <div className="flex items-start gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] flex items-center justify-center flex-shrink-0 text-[var(--brand-400)]">
                <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)] text-base">Application Fee</p>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">The PKR amount charged to every applicant per job application.</p>
              </div>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-1.5 w-48">
                  <label htmlFor="app-fee" className="text-sm font-medium text-[var(--text-secondary)]">
                    Fee Amount (PKR) <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-muted)] pointer-events-none">PKR</span>
                    <input
                      id="app-fee"
                      type="number"
                      min="1"
                      step="1"
                      value={appFee}
                      onChange={e => { setAppFee(Number(e.target.value)); setFeeError(""); }}
                      className="w-full h-10 pl-11 pr-3 rounded-[var(--radius-md)] border bg-[var(--bg-elevated)] border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 hover:border-[var(--border-hover)] transition-all"
                    />
                  </div>
                  {feeError && <p className="text-xs font-medium text-[var(--color-error)]">{feeError}</p>}
                </div>
                <div className="flex flex-col gap-0.5 text-xs text-[var(--text-muted)] pb-1">
                  <span>Net you receive: <strong className="text-[var(--color-success)]">PKR {Math.round(appFee * (100 - platformCut) / 100)}</strong></span>
                  <span>Platform cut ({platformCut}%): PKR {Math.round(appFee * platformCut / 100)}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-default)]">
                {feeSaved && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
                    <Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                <Button variant="gradient" size="md" pill loading={feeSaving} onClick={saveFee}>
                  Save Fee
                </Button>
              </div>
            </div>
          </div>

          {/* Platform Cut Card */}
          <div className={`${CARD} overflow-hidden`}>
            <div className="flex items-start gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] flex items-center justify-center flex-shrink-0 text-[var(--color-warning)]">
                <Icon path="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)] text-base">Platform Cut</p>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">The % you charge applicants as a platform/processing fee.</p>
              </div>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-1.5 w-48">
                  <label htmlFor="platform-cut" className="text-sm font-medium text-[var(--text-secondary)]">
                    Platform Cut (%) <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="platform-cut"
                      type="number"
                      min="0"
                      max="99"
                      step="1"
                      value={platformCut}
                      onChange={e => { setPlatformCut(Number(e.target.value)); setCutError(""); }}
                      className="w-full h-10 pl-3 pr-8 rounded-[var(--radius-md)] border bg-[var(--bg-elevated)] border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 hover:border-[var(--border-hover)] transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-muted)] pointer-events-none">%</span>
                  </div>
                  {cutError && <p className="text-xs font-medium text-[var(--color-error)]">{cutError}</p>}
                </div>
                <div className="flex flex-col gap-0.5 text-xs text-[var(--text-muted)] pb-1">
                  <span>Applicant pays: <strong className="text-[var(--text-primary)]">PKR {appFee}</strong></span>
                  <span>You keep: <strong className="text-[var(--color-success)]">PKR {Math.round(appFee * (100 - platformCut) / 100)}</strong></span>
                  <span>Platform fee: PKR {Math.round(appFee * platformCut / 100)}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-default)]">
                {cutSaved && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
                    <Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                <Button variant="gradient" size="md" pill loading={cutSaving} onClick={savePlatformCut}>
                  Save Cut
                </Button>
              </div>
            </div>
          </div>

          {/* Info banner */}          <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--brand-500)_8%,transparent)] border border-[color-mix(in_srgb,var(--brand-500)_20%,transparent)]">
            <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-[var(--brand-500)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">How it works</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                When a seeker clicks "Apply", they see your payment details below, send{" "}
                <strong>PKR {appFee}</strong> to the configured account, then upload
                their receipt. You approve the receipt in <strong>Admin → Payments</strong>.
              </p>
            </div>
          </div>

          {/* Payment method cards */}
          {PAYMENT_METHODS.map(pm => {
            const cfg = methods[pm.key];
            const ss  = saveState[pm.key];
            const err = saveError[pm.key];

            return (
              <div key={pm.key} className={`${CARD} overflow-hidden`}>

                {/* Method header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                  <div className="flex items-center gap-3">
                    <div className={[
                      "w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center font-black text-sm text-white",
                      pm.key === "jazzcash" ? "bg-[#cc2229]" : "bg-[#3d7f41]",
                    ].join(" ")} aria-hidden="true">
                      {pm.logo}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-base">{pm.label}</p>
                      <Badge variant={cfg.active ? "success" : "neutral"} size="sm" dot>
                        {cfg.active ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  {/* Enable/disable toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs text-[var(--text-muted)]">{cfg.active ? "Enabled" : "Disabled"}</span>
                    <div className="relative">
                      <input type="checkbox" checked={cfg.active}
                        onChange={e => handleToggle(pm.key, e.target.checked)}
                        className="sr-only peer"
                        aria-label={`${cfg.active ? "Disable" : "Enable"} ${pm.label}`}
                      />
                      <div className="w-9 h-5 rounded-full border-2 border-[var(--border-default)] peer-checked:bg-[var(--brand-500)] peer-checked:border-[var(--brand-500)] bg-[var(--bg-elevated)] transition-all duration-[var(--dur-default)]" />
                      <div className="absolute top-[3px] left-[3px] w-3 h-3 rounded-full bg-[var(--text-muted)] peer-checked:bg-white peer-checked:translate-x-4 transition-all duration-[var(--dur-default)]" />
                    </div>
                  </label>
                </div>

                {/* Disable confirmation — UI/UX SOP §Hard Rule 5 */}
                {deleteConfirm === pm.key && (
                  <div className="px-6 py-4 bg-[color-mix(in_srgb,var(--color-warning)_8%,transparent)] border-b border-[var(--border-default)] flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[var(--color-warning)] flex items-center gap-2">
                      <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-4 h-4 flex-shrink-0" />
                      Disable {pm.label}?
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Applicants won't see {pm.label} as a payment option until you re-enable it.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Keep enabled</Button>
                      <Button variant="danger" size="sm" onClick={() => confirmDisable(pm.key)}>Yes, disable</Button>
                    </div>
                  </div>
                )}

                {/* Form fields */}
                <div className={`px-6 py-5 flex flex-col gap-5 transition-opacity ${!cfg.active ? "opacity-50 pointer-events-none" : ""}`}>

                  <FormInput
                    label={`${pm.label} Phone / Till ID`}
                    name={`${pm.key}-phone`}
                    type="tel"
                    size="lg"
                    placeholder="e.g. 03001234567"
                    required
                    value={cfg.phone}
                    onChange={e => update(pm.key, "phone", e.target.value)}
                    helperText="The mobile number or till ID applicants send money to."
                    iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>}
                  />

                  <FormInput
                    label="Account Title (Receiver Name)"
                    name={`${pm.key}-name`}
                    type="text"
                    size="lg"
                    placeholder="e.g. RozeDesk Pvt Ltd"
                    required
                    value={cfg.name}
                    onChange={e => update(pm.key, "name", e.target.value)}
                    helperText="Shown to applicants so they can verify the correct account."
                    iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                  />

                  <FormInput
                    label="Address / Additional Note"
                    name={`${pm.key}-address`}
                    type="text"
                    size="md"
                    placeholder="e.g. Lahore, Pakistan — or leave blank"
                    value={cfg.address}
                    onChange={e => update(pm.key, "address", e.target.value)}
                    helperText="Optional. Shown below the payment details on the apply page."
                  />

                  {/* Save row */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-default)]">
                    {err && <p className="text-xs font-medium text-[var(--color-error)] flex-1">{err}</p>}
                    {ss === "saved" && !err && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
                        <Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5" /> Saved
                      </span>
                    )}
                    <Button variant="gradient" size="md" pill loading={ss === "saving"} onClick={() => save(pm.key)}>
                      Save {pm.label} Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: live preview */}
        <div className="lg:col-span-1">
          <div className={`${CARD} p-5 lg:sticky lg:top-6`}>
            <p className="font-bold text-[var(--text-primary)] text-base mb-1 flex items-center gap-2">
              <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4 text-[var(--brand-500)]" />
              Applicant Preview
            </p>
            <p className="text-[var(--text-muted)] text-xs mb-4">This is what applicants see when paying their fee.</p>

            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.filter(pm => methods[pm.key].active).map(pm => {
                const cfg = methods[pm.key];
                return (
                  <div key={pm.key} className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
                    <div className={[
                      "w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center font-black text-sm text-white flex-shrink-0",
                      pm.key === "jazzcash" ? "bg-[#cc2229]" : "bg-[#3d7f41]",
                    ].join(" ")} aria-hidden="true">
                      {pm.logo}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{pm.label}</p>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Send <strong>PKR {appFee}</strong> to <strong>{cfg.phone || "—"}</strong>
                      </p>
                      <p className="text-[var(--text-muted)] text-xs">{cfg.name || "—"}</p>
                      {cfg.address && <p className="text-[var(--text-muted)] text-xs">{cfg.address}</p>}
                    </div>
                  </div>
                );
              })}

              {PAYMENT_METHODS.every(pm => !methods[pm.key].active) && (
                <p className="text-[var(--color-error)] text-sm font-medium flex items-center gap-2">
                  <Icon path="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                  No active methods — applicants can't pay.
                </p>
              )}
            </div>

            {/* Fee summary */}
            <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex flex-col gap-1.5">
              {[
                { label: "Application fee",   value: `PKR ${appFee}`,                                          className: "text-[var(--text-primary)] font-semibold" },
                { label: `Processing (${platformCut}%)`, value: `- PKR ${Math.round(appFee * platformCut / 100)}`, className: "text-[var(--text-muted)]" },
                { label: "You receive",       value: `PKR ${Math.round(appFee * (100 - platformCut) / 100)}`,  className: "text-[var(--color-success)] font-bold" },
              ].map((row, i) => (
                <div key={row.label} className={`flex items-center justify-between text-xs ${i === 2 ? "border-t border-[var(--border-default)] pt-1.5 mt-0.5 font-bold" : ""}`}>
                  <span className="text-[var(--text-muted)]">{row.label}</span>
                  <span className={row.className}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
