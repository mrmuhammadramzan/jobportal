"use client";
/**
 * DateFilter — reusable date range selector for admin dashboard pages.
 *
 * DRY Hard Rule 1: one component, used on admin overview, analytics, and ledger.
 * Never build a date filter inline in a page.
 *
 * Presets:   Today (default) · 24 Hours · This Week · This Month · This Year
 * Custom:    date-from + date-to inputs shown when "Custom" is selected
 *
 * UI/UX SOP §Hard Rule 1: all 4 states — default (Today), selected preset,
 *   custom range open, custom range filled.
 * UI/UX SOP §Hard Rule 2: keyboard operable — tab through presets and date inputs.
 * UI/UX SOP §Hard Rule 3: all contrast via CSS var tokens.
 * UI/UX SOP §Hard Rule 4: active preset uses brand-500 bg + white text (colour + label).
 * Frontend SOP §7: custom date inputs have visible labels (sr-only).
 *
 * Usage:
 *   const [range, setRange] = useDateFilter();
 *   <DateFilter value={range} onChange={setRange} />
 *
 * The `value` exposes { preset, from, to } so callers can filter data arrays.
 */
import React, { useState, useId } from "react";

/* ── Preset definition ── */
export type DatePreset = "today" | "24h" | "week" | "month" | "year" | "custom";

export interface DateRange {
  preset: DatePreset;
  /** ISO date string YYYY-MM-DD — populated for all presets and custom */
  from:   string;
  /** ISO date string YYYY-MM-DD */
  to:     string;
}

interface DateFilterProps {
  value:     DateRange;
  onChange:  (range: DateRange) => void;
  className?: string;
}

/* ── Preset label map — single source, DRY ── */
const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today",  label: "Today"      },
  { key: "24h",    label: "24 Hours"   },
  { key: "week",   label: "This Week"  },
  { key: "month",  label: "This Month" },
  { key: "year",   label: "This Year"  },
  { key: "custom", label: "Custom"     },
];

/* ── Date helpers — pure functions, no side-effects ── */
function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function rangeForPreset(preset: Exclude<DatePreset, "custom">): { from: string; to: string } {
  const now   = new Date();
  const today = toIso(now);

  switch (preset) {
    case "today": {
      return { from: today, to: today };
    }
    case "24h": {
      const d = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return { from: toIso(d), to: today };
    }
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay()); // start of week (Sun)
      return { from: toIso(d), to: today };
    }
    case "month": {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: toIso(d), to: today };
    }
    case "year": {
      const d = new Date(now.getFullYear(), 0, 1);
      return { from: toIso(d), to: today };
    }
  }
}

/**
 * useDefaultDateRange — initialise a DateRange with Today as default.
 * Call once in the parent page's useState.
 */
export function useDefaultDateRange(): DateRange {
  const { from, to } = rangeForPreset("today");
  return { preset: "today", from, to };
}

/**
 * buildApiParams — DRY helper used by every admin page that calls a date-filtered API.
 *
 * For named presets  → returns `period=today` (etc.)
 * For custom ranges  → returns `period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD`
 *
 * Usage:
 *   const qs = buildApiParams(dateRange);
 *   fetch(`/api/admin/analytics?${qs}`, ...)
 */
export function buildApiParams(range: DateRange): string {
  const p = new URLSearchParams({ period: range.preset });
  if (range.preset === "custom") {
    if (range.from) p.set("from", range.from);
    if (range.to)   p.set("to",   range.to);
  }
  return p.toString();
}

/* ── Calendar icon ── */
function CalendarIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

/* ════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════ */
export default function DateFilter({ value, onChange, className = "" }: DateFilterProps) {
  const fromId = useId();
  const toId   = useId();

  /* Local custom date state — only pushed upstream on both fields filled */
  const [customFrom, setCustomFrom] = useState(value.preset === "custom" ? value.from : "");
  const [customTo,   setCustomTo]   = useState(value.preset === "custom" ? value.to   : "");

  function handlePreset(preset: DatePreset) {
    if (preset === "custom") {
      onChange({ preset: "custom", from: customFrom, to: customTo });
      return;
    }
    const { from, to } = rangeForPreset(preset);
    onChange({ preset, from, to });
  }

  function handleCustomFrom(v: string) {
    setCustomFrom(v);
    if (v && customTo) onChange({ preset: "custom", from: v, to: customTo });
  }
  function handleCustomTo(v: string) {
    setCustomTo(v);
    if (customFrom && v) onChange({ preset: "custom", from: customFrom, to: v });
  }

  /* Compute a human-readable summary for the current range */
  function rangeLabel(): string {
    if (value.preset === "custom") {
      if (value.from && value.to)
        return `${value.from} → ${value.to}`;
      return "Select dates";
    }
    return PRESETS.find(p => p.key === value.preset)?.label ?? "";
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Preset pills */}
      <div
        className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-x-auto flex-wrap"
        role="group"
        aria-label="Date range filter"
      >
        {PRESETS.map(p => {
          const active = value.preset === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => handlePreset(p.key)}
              aria-pressed={active}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap",
                "transition-all duration-[var(--dur-fast)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                active
                  /* Active: brand bg + white text — UI/UX SOP §Hard Rule 4 colour + text */
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
              ].join(" ")}
            >
              {p.key === "today" && <CalendarIcon />}
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom date range inputs — shown only when "Custom" is selected */}
      {value.preset === "custom" && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <div className="flex flex-col gap-1 flex-1">
            {/* sr-only label — visible label provided by the pill above */}
            <label htmlFor={fromId} className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              From
            </label>
            <input
              id={fromId}
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={e => handleCustomFrom(e.target.value)}
              className="h-9 px-3 rounded-[var(--radius-md)] border bg-[var(--bg-base)] border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor={toId} className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              To
            </label>
            <input
              id={toId}
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={e => handleCustomTo(e.target.value)}
              className="h-9 px-3 rounded-[var(--radius-md)] border bg-[var(--bg-base)] border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"
            />
          </div>
        </div>
      )}

      {/* Range summary — always visible, screen-reader friendly */}
      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
        <CalendarIcon />
        Showing data for: <span className="font-semibold text-[var(--text-primary)]">{rangeLabel()}</span>
      </p>
    </div>
  );
}
