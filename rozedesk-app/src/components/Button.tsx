/**
 * Button — single source of truth for all buttons in RozeDesk.
 * DRY Rule: call <Button> with props, never style a button inline.
 *
 * Props:
 *  variant  — "primary" | "secondary" | "ghost" | "outline" | "gradient" | "danger"
 *  size     — "sm" | "md" | "lg" | "xl"
 *  href     — renders as <a> if provided
 *  icon     — ReactNode shown left of label
 *  iconRight — ReactNode shown right of label
 *  fullWidth — stretches to container width
 *  loading  — shows spinner, disables interaction
 *  glow     — adds brand glow shadow on hover
 *  pill     — full pill radius instead of default
 */

import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "gradient" | "danger";
type ButtonSize    = "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  /** Left-side icon. Accepts `icon` or `iconLeft` — both work (DRY alias). */
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  pill?: boolean;
  external?: boolean;
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

/* ── Design-token-driven style maps ── */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-500)] text-white border-transparent " +
    "hover:bg-[var(--brand-600)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand)] " +
    "active:bg-[var(--brand-700)] active:translate-y-0 active:scale-[0.97] " +
    "focus-visible:ring-[var(--brand-500)]",

  secondary:
    "bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-200)] " +
    "hover:bg-[var(--brand-100)] hover:-translate-y-0.5 " +
    "active:bg-[var(--brand-200)] active:translate-y-0 active:scale-[0.97]",

  ghost:
    "bg-transparent text-[var(--text-secondary)] border-transparent " +
    "hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] " +
    "active:scale-[0.97]",

  outline:
    "bg-transparent text-[var(--text-primary)] border-[var(--border-default)] " +
    "hover:border-[var(--brand-500)] hover:text-[var(--brand-600)] hover:-translate-y-0.5 " +
    "active:scale-[0.97]",

  gradient:
    /* logo gradient: brand-blue → teal-accent — matches logo colour story */
    "text-white border-transparent relative overflow-hidden " +
    "bg-gradient-to-r from-[var(--brand-500)] via-[var(--brand-400)] to-[var(--accent-400)] " +
    "bg-[length:200%_100%] hover:bg-right hover:-translate-y-0.5 " +
    "hover:shadow-[var(--shadow-brand)] active:translate-y-0 active:scale-[0.97]",

  danger:
    "bg-[var(--color-error)] text-white border-transparent " +
    "hover:brightness-110 hover:-translate-y-0.5 " +
    "active:brightness-90 active:translate-y-0 active:scale-[0.97]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8  px-3  text-[var(--text-sm)]  gap-1.5",
  md: "h-10 px-4  text-[var(--text-sm)]  gap-2",
  lg: "h-12 px-6  text-[var(--text-base)] gap-2",
  xl: "h-14 px-8  text-[var(--text-md)]  gap-2.5",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-5   h-5",
  xl: "w-5   h-5",
};

function Spinner({ size }: { size: ButtonSize }) {
  return (
    <span
      className={`${ICON_SIZE[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
      aria-hidden="true"
    />
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  glow = false,
  pill = false,
  external = false,
  className = "",
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  /* iconLeft is an alias for icon — accept both */
  const leftIcon = iconLeft ?? icon;
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center font-medium border " +
    "transition-all duration-[var(--dur-default)] " +
    "select-none whitespace-nowrap " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ";

  const radius = pill ? "rounded-full" : "rounded-[var(--radius-md)]";

  const glowClass = glow && !isDisabled ? "hover:shadow-[var(--shadow-brand)]" : "";

  const disabledClass = isDisabled
    ? "opacity-40 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  const width = fullWidth ? "w-full" : "";

  const classes = [
    base,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    radius,
    glowClass,
    disabledClass,
    width,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {loading ? (
        <Spinner size={size} />
      ) : leftIcon ? (
        <span className={`${ICON_SIZE[size]} flex-shrink-0`} aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      <span className={loading ? "opacity-0 absolute" : ""}>{children}</span>
      {!loading && iconRight && (
        <span className={`${ICON_SIZE[size]} flex-shrink-0`} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  );

  if (href) {
    return external ? (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        aria-busy={loading}
        onClick={onClick}
      >
        {inner}
      </a>
    ) : (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        aria-busy={loading}
        onClick={onClick}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
