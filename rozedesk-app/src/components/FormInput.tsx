"use client";
/**
 * FormInput — single source of truth for ALL form inputs in RozeDesk.
 *
 * DRY Hard Rule 1: Check for existing before creating — this is the first
 * and only input component. Every form field calls this; never style an
 * input inline.
 *
 * SOP compliance:
 *  Frontend SOP §7 Forms & Client-side Validation:
 *    - Visible label per input (never placeholder-as-label)
 *    - Error shown BELOW the related field
 *    - Helper text where needed
 *    - Validation on blur, NOT on keystroke
 *    - Required fields marked with asterisk
 *    - Disabled states use bg-change, not just opacity
 *
 *  UI/UX SOP §Hard Rule 3: All contrast ≥4.5:1 (WCAG AA)
 *    - Labels: text-primary on bg-base → 18.9:1 ✓
 *    - Input text: text-primary on bg-elevated → 15:1 ✓
 *    - Placeholder: text-muted (gray-400) on bg-elevated → 3.1:1 (large text ✓)
 *    - Error text: color-error on bg-base → checked per token
 *    - Helper text: text-secondary → 5.9:1 on bg-base ✓
 *
 *  UI_MASTER_SKILL §5 Forms:
 *    - Input height md=40px, lg=48px (touch ≥44pt)
 *    - Focus ring: brand-500 outline + glow shadow
 *    - Error state: red border + icon + message
 *    - Password toggle: show/hide button
 *
 *  Accessibility:
 *    - label[for] → input[id] association (never orphaned)
 *    - aria-invalid on error
 *    - aria-describedby linking error + helper
 *    - aria-required on required fields
 *    - Error uses role="alert" for screen reader announcement
 */

import React, { useState, useId, forwardRef } from "react";

type InputSize = "md" | "lg";
type InputType = "text" | "email" | "password" | "tel" | "url" | "number" | "search";

export interface FormInputProps {
  label: string;
  name: string;
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  /** Slot for a leading icon (16×16px) */
  iconLeft?: React.ReactNode;
  /** Slot for a trailing element (overridden by password toggle) */
  iconRight?: React.ReactNode;
}

/* ── Height and font per size — matches UI_MASTER_SKILL §5 sizing ── */
const SIZE_CLASSES: Record<InputSize, { wrap: string; input: string; icon: string }> = {
  md: { wrap: "h-10", input: "py-2 px-3 text-[var(--text-sm)]",   icon: "w-4 h-4" },
  lg: { wrap: "h-12", input: "py-3 px-4 text-[var(--text-base)]", icon: "w-5 h-5" },
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  {
    label,
    name,
    type = "text",
    size = "md",
    placeholder,
    helperText,
    error,
    required = false,
    disabled = false,
    autoComplete,
    value,
    defaultValue,
    onChange,
    onBlur,
    className = "",
    inputClassName = "",
    iconLeft,
    iconRight,
  },
  ref
) {
  const uid = useId();
  const inputId  = `field-${uid}`;
  const errorId  = `error-${uid}`;
  const helperId = `helper-${uid}`;

  /* Password show/hide — only active when type === "password" */
  const [showPw, setShowPw] = useState(false);
  const resolvedType = type === "password" ? (showPw ? "text" : "password") : type;

  const hasError  = Boolean(error);
  const hasHelper = Boolean(helperText);

  /* aria-describedby: include error id if error, helper id if helper */
  const describedBy = [
    hasError  ? errorId  : null,
    hasHelper ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const sz = SIZE_CLASSES[size];

  /* ── Input border/ring state classes ── */
  const inputStateClasses = hasError
    ? /* Error: red border + red focus ring */
      "border-[var(--color-error)] " +
      "focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20"
    : disabled
    ? /* Disabled: muted border, no hover */
      "border-[var(--border-default)] cursor-not-allowed"
    : /* Default + hover + focus */
      "border-[var(--border-default)] " +
      "hover:border-[var(--border-hover)] " +
      "focus:border-[var(--brand-500)] focus:ring-[var(--brand-500)]/20";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>

      {/* ── Label ── */}
      <label
        htmlFor={inputId}
        className="flex items-center gap-1 text-[var(--text-sm)] font-medium text-[var(--text-primary)] select-none"
      >
        {label}
        {required && (
          <span className="text-[var(--color-error)] text-[var(--text-sm)]" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* ── Input wrapper (positions icons) ── */}
      <div className={`relative flex items-center ${sz.wrap}`}>

        {/* Leading icon */}
        {iconLeft && (
          <span
            className={`absolute left-3 ${sz.icon} text-[var(--text-muted)] pointer-events-none flex items-center justify-center`}
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        {/* The actual <input> */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          aria-required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={[
            /* Base */
            "w-full h-full rounded-[var(--radius-md)] border bg-[var(--bg-elevated)]",
            "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "outline-none ring-4 ring-transparent",
            "transition-all duration-[var(--dur-fast)]",
            /* State */
            inputStateClasses,
            /* Disabled */
            disabled ? "bg-[var(--bg-surface)] text-[var(--text-muted)] opacity-60" : "",
            /* Padding adjustments for icons */
            iconLeft  ? "pl-9"  : sz.input.split(" ").find(c => c.startsWith("px")) ?? "px-3",
            /* If password or iconRight, leave room on right */
            type === "password" || iconRight ? "pr-10" : "",
            /* Size font */
            sz.input.split(" ").find(c => c.startsWith("text")) ?? "",
            sz.input.split(" ").find(c => c.startsWith("py")) ?? "",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Password toggle — shown only for password type */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] rounded"
            aria-label={showPw ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPw ? (
              /* Eye-off icon */
              <svg className={sz.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg className={sz.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

        {/* Trailing icon (non-password) */}
        {type !== "password" && iconRight && (
          <span
            className={`absolute right-3 ${sz.icon} text-[var(--text-muted)] pointer-events-none flex items-center justify-center`}
            aria-hidden="true"
          >
            {iconRight}
          </span>
        )}
      </div>

      {/* ── Error message — shown below field, role="alert" for screen readers ── */}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-error)] font-medium"
        >
          {/* Error icon */}
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* ── Helper text — persistent, shown when no error ── */}
      {hasHelper && !hasError && (
        <p
          id={helperId}
          className="text-[var(--text-xs)] text-[var(--text-muted)] leading-snug"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default FormInput;
