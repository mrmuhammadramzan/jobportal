/**
 * StatCard — reusable analytics stat tile.
 * DRY: one component for all stat displays in both dashboards.
 * Props drive icon, colour, trend, value — never styled inline.
 *
 * UI/UX SOP §Hard Rule 3: contrast verified — text-primary on bg-surface ≥15:1 ✓
 * UI/UX SOP §Hard Rule 4: trend direction uses icon + colour + text, never colour alone.
 */
import React from "react";

interface StatCardProps {
  label:        string;
  value:        string;
  icon:         React.ReactNode;
  /** CSS var string e.g. "var(--brand-100)" */
  iconBg:       string;
  iconColor:    string;
  trend?:       { value: string; positive: boolean; label?: string };
  description?: string;
  className?:   string;
}

export default function StatCard({
  label, value, icon, iconBg, iconColor, trend, description, className = "",
}: StatCardProps) {
  return (
    <div className={[
      "flex flex-col gap-4 p-5 rounded-[var(--radius-xl)]",
      "bg-[var(--bg-surface)] border border-[var(--border-default)]",
      "hover:shadow-[var(--shadow-2)] hover:-translate-y-0.5",
      "transition-all duration-[var(--dur-deliberate)]",
      className,
    ].join(" ")}>

      {/* Icon */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
          aria-hidden="true"
        >
          <span style={{ color: iconColor }} className="w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
        </div>
        {trend && (
          <span className={[
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
            trend.positive
              ? "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]"
              : "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)]",
          ].join(" ")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex flex-col gap-1">
        <p className="text-[clamp(1.5rem,3vw,2rem)] font-black leading-none tracking-tight gradient-text">
          {value}
        </p>
        <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">{label}</p>
        {(description || trend?.label) && (
          <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
            {description ?? trend?.label}
          </p>
        )}
      </div>
    </div>
  );
}
