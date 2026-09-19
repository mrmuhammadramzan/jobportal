/**
 * StatCard — single source of truth for all statistics/metrics display.
 * DRY Rule: one component, driven by props.
 */
import React from "react";

interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export default function StatCard({
  value,
  label,
  suffix,
  description,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={[
        "flex flex-col gap-2 p-6",
        "bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-xl)]",
        "hover:shadow-[var(--shadow-2)] hover:-translate-y-1",
        "transition-all duration-[var(--dur-deliberate)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--brand-100)] flex items-center justify-center text-[var(--brand-600)]" aria-hidden="true">
          <span className="w-5 h-5">{icon}</span>
        </div>
      )}

      <div className="flex items-end gap-1">
        <span className="text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tight gradient-text">
          {value}
        </span>
        {suffix && (
          <span className="text-[var(--text-lg)] font-bold text-[var(--brand-500)] mb-1">
            {suffix}
          </span>
        )}
      </div>

      <span className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">
        {label}
      </span>

      {description && (
        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">
          {description}
        </span>
      )}

      {trend && (
        <span
          className={[
            "text-[var(--text-xs)] font-semibold flex items-center gap-1",
            trend.positive ? "text-[var(--color-success)]" : "text-[var(--color-error)]",
          ].join(" ")}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </span>
      )}
    </div>
  );
}
