"use client";
/**
 * ThemeToggle — centralised dark / light mode switcher.
 *
 * DRY Hard Rule 1: one component used everywhere.
 *
 * ANIMATION (new):
 *   The sun and moon icons animate with a rotate + scale transition.
 *   Exiting icon spins out and shrinks, entering icon spins in and grows.
 *   Uses CSS keyframes defined here via inline style — no extra CSS file needed.
 *   Reduced-motion: skips all animation (prefers-reduced-motion respected).
 *
 * UI/UX SOP §Hard Rule 4: icon + aria-label — never icon alone.
 * UI/UX SOP §Hard Rule 2: keyboard operable, visible focus ring.
 */
import React, { useEffect, useState, useCallback } from "react";

type ThemeVariant = "default" | "admin";

interface ThemeToggleProps {
  showLabel?: boolean;
  variant?:   ThemeVariant;
  className?: string;
}

function getStoredTheme(): "dark" | "light" | null {
  try { return localStorage.getItem("rozedesk-theme") as "dark" | "light" | null; }
  catch { return null; }
}
function getOSTheme(): "dark" | "light" {
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
  catch { return "dark"; }
}
function applyTheme(theme: "dark" | "light"): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  try { localStorage.setItem("rozedesk-theme", theme); } catch { /* ignore */ }
}

export default function ThemeToggle({
  showLabel = false,
  variant   = "default",
  className = "",
}: ThemeToggleProps) {
  const [theme,     setTheme]     = useState<"dark" | "light">("dark");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const resolved = getStoredTheme() ?? getOSTheme();
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggle = useCallback(() => {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    /* Trigger animation */
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    setTheme(next);
    applyTheme(next);
  }, [theme]);

  const isDark    = theme === "dark";
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  const base = [
    "relative flex items-center gap-1.5 h-8 rounded-[var(--radius-md)] overflow-hidden",
    "font-medium text-xs select-none",
    "transition-colors duration-[var(--dur-default)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-1",
    showLabel ? "px-2.5" : "w-8 justify-center",
  ].join(" ");

  const color = variant === "admin"
    ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-hover)]"
    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-hover)]";

  return (
    <>
      {/* Keyframes injected once — reduced-motion is respected via CSS */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .theme-icon-enter {
            animation: themeIconEnter 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .theme-icon-exit {
            animation: themeIconExit 0.2s ease-in forwards;
          }
          @keyframes themeIconEnter {
            from { opacity: 0; transform: rotate(-90deg) scale(0.5); }
            to   { opacity: 1; transform: rotate(0deg)   scale(1);   }
          }
          @keyframes themeIconExit {
            from { opacity: 1; transform: rotate(0deg)   scale(1);   }
            to   { opacity: 0; transform: rotate(90deg)  scale(0.5); }
          }
        }
      `}</style>

      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-pressed={!isDark}
        title={ariaLabel}
        className={[base, color, className].filter(Boolean).join(" ")}
      >
        {/* Animated icon — key forces remount + re-animation on toggle */}
        <span
          key={theme}
          className={animating ? "theme-icon-enter" : ""}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>

        {showLabel && (
          <span className="leading-none whitespace-nowrap">
            {isDark ? "Light" : "Dark"}
          </span>
        )}
      </button>
    </>
  );
}

function SunIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
