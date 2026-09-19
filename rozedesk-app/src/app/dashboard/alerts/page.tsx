"use client";
/**
 * /dashboard/alerts — Job Alerts manager.
 *
 * Wired to:
 *   GET    /api/seeker/alerts         — load on mount
 *   POST   /api/seeker/alerts         — create alert
 *   PATCH  /api/seeker/alerts/[id]    — toggle active/paused
 *   DELETE /api/seeker/alerts/[id]    — delete alert
 *
 * Frontend SOP §6.1: loading / error / empty / populated states.
 * Frontend SOP §7: every form input has a visible label, required marked.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: token(), Icon, FIELD — each defined once.
 */
import React, { useState, useEffect, useCallback } from "react";
import Button    from "@/components/Button";
import FormInput from "@/components/FormInput";
import Badge     from "@/components/Badge";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { useToast } from "@/components/Toast";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/** DRY: single token getter — correct key "rozedesk-token" */
function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

interface Alert {
  id: string; keywords: string; location: string;
  type: string; frequency: string; active: boolean;
  createdAt?: string;
}

const LOCATIONS = ["Any", "Lahore", "Karachi", "Islamabad", "Remote"];
const TYPES     = ["Any", "Full-time", "Part-time", "Contract", "Remote"];
const FREQS     = ["Instant", "Daily", "Weekly"];

const FIELD = [
  "h-10 px-3 rounded-[var(--radius-md)] border",
  "bg-[var(--bg-elevated)] border-[var(--border-default)]",
  "text-sm text-[var(--text-primary)]",
  "outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
  "transition-all appearance-none cursor-pointer",
].join(" ");

const FREQ_ICON: Record<string, string> = {
  Instant: "M13 10V3L4 14h7v7l9-11h-7z",
  Daily:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  Weekly:  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
};

export default function AlertsPage() {
  const [alerts,    setAlerts]    = useState<Alert[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  /* Form state */
  const [showForm,  setShowForm]  = useState(false);
  const [kw,        setKw]        = useState("");
  const [kwError,   setKwError]   = useState("");
  const [loc,       setLoc]       = useState("Any");
  const [type,      setType]      = useState("Any");
  const [freq,      setFreq]      = useState("Daily");
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState("");

  /* Per-alert action state */
  const [toggling,  setToggling]  = useState<Record<string, boolean>>({});
  const [deleting,  setDeleting]  = useState<Record<string, boolean>>({});
  const toast = useToast();

  /* ── Load alerts on mount ── */
  useEffect(() => {
    fetch("/api/seeker/alerts", {
      credentials: "include",
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load alerts")))
      .then(data => setAlerts(Array.isArray(data) ? data : (data.alerts ?? [])))
      .catch(e => setLoadError(e.message ?? "Could not load alerts."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Create alert ── */
  const createAlert = useCallback(async () => {
    setKwError("");
    if (!kw.trim()) { setKwError("Keywords are required."); return; }

    setSaving(true); setSaveError("");
    try {
      const res  = await fetch("/api/seeker/alerts", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        credentials: "include",
        body: JSON.stringify({ keywords: kw.trim(), location: loc, type, frequency: freq }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to create alert.");
      setAlerts(prev => [data, ...prev]);
      /* Reset form */
      setKw(""); setLoc("Any"); setType("Any"); setFreq("Daily");
      setShowForm(false);
      toast.success("Alert created! You'll be notified of matching jobs.");
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Failed to create alert.");
      toast.error(e instanceof Error ? e.message : "Failed to create alert.");
    } finally {
      setSaving(false);
    }
  }, [kw, loc, type, freq]);

  /* ── Toggle active/paused (optimistic + revert) ── */
  const toggleAlert = useCallback(async (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (!alert || toggling[id]) return;

    /* Optimistic */
    setToggling(p => ({ ...p, [id]: true }));
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));

    try {
      const res = await fetch(`/api/seeker/alerts/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        credentials: "include",
        body: JSON.stringify({ active: !alert.active }),
      });
      if (!res.ok) throw new Error();
    } catch {
      /* Revert on failure */
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: alert.active } : a));
      toast.error("Failed to update alert.");
    } finally {
      setToggling(p => ({ ...p, [id]: false }));
    }
  }, [alerts, toggling]);

  /* ── Delete alert (optimistic + revert) ── */
  const deleteAlert = useCallback(async (id: string) => {
    const backup = alerts.find(a => a.id === id);
    if (!backup || deleting[id]) return;

    /* Optimistic */
    setDeleting(p => ({ ...p, [id]: true }));
    setAlerts(prev => prev.filter(a => a.id !== id));

    try {
      const res = await fetch(`/api/seeker/alerts/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error();
    } catch {
      /* Revert on failure */
      setAlerts(prev => [backup, ...prev.filter(a => a.id !== id)]);
    } finally {
      setDeleting(p => ({ ...p, [id]: false }));
    }
  }, [alerts, deleting]);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Job Alerts</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {loading ? "Loading…" : `${alerts.length} alert${alerts.length !== 1 ? "s" : ""} · Get notified when new jobs match your preferences.`}
          </p>
        </div>
        <Button variant="gradient" size="md" pill onClick={() => { setShowForm(s => !s); setSaveError(""); setKwError(""); }}
          iconLeft={<Icon path="M12 4v16m8-8H4" className="w-4 h-4" />}>
          + New Alert
        </Button>
      </div>

      {/* Load error */}
      {loadError && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{loadError}</p>
          <button type="button" onClick={() => window.location.reload()}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline">Retry</button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--brand-300)] flex flex-col gap-4">
          <h3 className="font-bold text-[var(--text-primary)] text-base">Create New Alert</h3>

          {saveError && (
            <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
              <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5"/>
              <p className="text-xs font-medium text-[var(--color-error)]">{saveError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormInput label="Keywords" name="kw" type="text" size="md" required
                placeholder="e.g. React Developer, Marketing Manager"
                value={kw}
                onChange={e => { setKw(e.target.value); setKwError(""); }}
                error={kwError}
                helperText="Enter a job title, skill, or company name."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="alert-loc" className="text-sm font-medium text-[var(--text-primary)]">Location</label>
              <select id="alert-loc" value={loc} onChange={e => setLoc(e.target.value)} className={FIELD}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="alert-type" className="text-sm font-medium text-[var(--text-primary)]">Job Type</label>
              <select id="alert-type" value={type} onChange={e => setType(e.target.value)} className={FIELD}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Notification Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {FREQS.map(f => (
                  <button key={f} type="button" onClick={() => setFreq(f)}
                    className={[
                      "flex flex-col items-center gap-1.5 p-3 rounded-[var(--radius-lg)] border text-xs font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                      freq === f
                        ? "bg-[var(--brand-500)] border-[var(--brand-500)] text-white"
                        : "bg-[var(--bg-base)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--brand-500)]",
                    ].join(" ")}>
                    <Icon path={FREQ_ICON[f] ?? "M12 8v4l3 3"} className="w-4 h-4"/>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border-default)]">
            <Button variant="ghost" size="md" onClick={() => { setShowForm(false); setSaveError(""); setKwError(""); }}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" pill loading={saving} onClick={createAlert}>
              Create Alert
            </Button>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>

      /* Empty state */
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
            <Icon path="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" className="w-5 h-5 text-[var(--text-muted)]"/>
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">No job alerts yet</p>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Create an alert and get notified when matching jobs are posted.
            </p>
          </div>
          <Button variant="gradient" size="md" pill onClick={() => setShowForm(true)}>
            Create Your First Alert
          </Button>
        </div>

      /* Alert list */
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map(a => (
            <div key={a.id}
              className="flex items-start gap-4 p-4 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all">

              {/* Alert icon — freq-based */}
              <div className={[
                "w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0",
                a.active
                  ? "bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)]"
                  : "bg-[var(--bg-surface)]",
              ].join(" ")}>
                <Icon
                  path={FREQ_ICON[a.frequency] ?? "M12 8v4l3 3"}
                  className={`w-4 h-4 ${a.active ? "text-[var(--brand-500)]" : "text-[var(--text-muted)]"}`}
                />
              </div>

              {/* Alert info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text-primary)] text-sm">{a.keywords}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    { label: a.location,  icon:"M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                    { label: a.type,      icon:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                    { label: a.frequency, icon: FREQ_ICON[a.frequency] ?? "M12 8v4l3 3" },
                  ].map((tag, i) => (
                    <span key={`${i}-${tag.label}`} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                      <Icon path={tag.icon} className="w-2.5 h-2.5"/>
                      {tag.label}
                    </span>
                  ))}
                  <Badge variant={a.active ? "success" : "neutral"} size="sm" dot>
                    {a.active ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                <button type="button"
                  disabled={toggling[a.id]}
                  onClick={() => toggleAlert(a.id)}
                  className="text-xs font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded"
                  aria-label={`${a.active ? "Pause" : "Resume"} alert for ${a.keywords}`}>
                  {toggling[a.id] ? "…" : a.active ? "Pause" : "Resume"}
                </button>
                <span className="w-px h-3 bg-[var(--border-default)]" aria-hidden="true"/>
                <button type="button"
                  disabled={deleting[a.id]}
                  onClick={() => deleteAlert(a.id)}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded"
                  aria-label={`Delete alert for ${a.keywords}`}>
                  {deleting[a.id] ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && alerts.length > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          {alerts.filter(a => a.active).length} active · {alerts.filter(a => !a.active).length} paused
        </p>
      )}
    </div>
  );
}
