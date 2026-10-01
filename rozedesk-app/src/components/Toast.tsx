"use client";
/**
 * Toast — lightweight, accessible toast notification system.
 *
 * DRY: one component + one hook for all toasts across the app.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success("Saved!");
 *   toast.info("New deposit request", { duration: 8000, onClick: () => router.push("/admin/game-deposits") });
 *
 * Place <ToastProvider> once in the root layout (already done).
 *
 * CHANGES (2026-09-26):
 *   - Added optional `onClick` callback — entire toast becomes a clickable
 *     button that navigates to a link or runs any action.
 *   - Added optional `duration` (ms, default 4000).
 *   - Backwards-compatible — all existing callers with just a string still work.
 */
import React, {
  createContext, useContext, useState, useCallback,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

/* ── Options — all optional so existing callers need zero changes ── */
export interface ToastOptions {
  duration?: number;          /* ms before auto-dismiss (default 4000) */
  onClick?:  () => void;      /* called when the toast body is clicked  */
}

interface ToastItem {
  id:       string;
  type:     ToastType;
  message:  string;
  onClick?: () => void;
}

interface ToastContextValue {
  success: (msg: string, opts?: ToastOptions) => void;
  error:   (msg: string, opts?: ToastOptions) => void;
  warning: (msg: string, opts?: ToastOptions) => void;
  info:    (msg: string, opts?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {}, error: () => {}, warning: () => {}, info: () => {},
});

/* ── Icon paths (one per type) ── */
const ICON: Record<ToastType, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error:   "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

/* ── Colour tokens — no hardcoded hex ── */
const COLOR: Record<ToastType, { wrap: string; icon: string }> = {
  success: {
    wrap: "bg-[rgba(15,23,42,0.96)] border-l-[3px] border-[var(--color-success)] border-t-transparent border-r-transparent border-b-transparent",
    icon: "text-[var(--color-success)]",
  },
  error: {
    wrap: "bg-[rgba(15,23,42,0.96)] border-l-[3px] border-[var(--color-error)] border-t-transparent border-r-transparent border-b-transparent",
    icon: "text-[var(--color-error)]",
  },
  warning: {
    wrap: "bg-[rgba(15,23,42,0.96)] border-l-[3px] border-[var(--color-warning)] border-t-transparent border-r-transparent border-b-transparent",
    icon: "text-[var(--color-warning)]",
  },
  info: {
    wrap: "bg-[rgba(15,23,42,0.96)] border-l-[3px] border-[var(--brand-400)] border-t-transparent border-r-transparent border-b-transparent",
    icon: "text-[var(--brand-400)]",
  },
};

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, message: string, opts?: ToastOptions) => {
    const id       = `toast_${Date.now()}_${Math.random()}`;
    const duration = opts?.duration ?? DEFAULT_DURATION;
    setToasts(p => [...p, { id, type, message, onClick: opts?.onClick }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    success: (m, o) => add("success", m, o),
    error:   (m, o) => add("error",   m, o),
    warning: (m, o) => add("warning", m, o),
    info:    (m, o) => add("info",    m, o),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* ── Toast container — bottom-right, above everything ── */}
      <div
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(t => {
          const clickable = !!t.onClick;
          return (
            /* ── Outer wrapper is always a div — HTML forbids <button> inside <button> ── */
            <div
              key={t.id}
              className={[
                "flex items-stretch gap-0 rounded-[var(--radius-xl)] shadow-[var(--shadow-2)]",
                "pointer-events-auto min-w-[280px] max-w-[380px]",
                "animate-[slideInRight_0.25s_ease]",
                COLOR[t.type].wrap,
              ].join(" ")}
              role="alert"
            >
              {/* ── Body: button when clickable, div otherwise ── */}
              {clickable ? (
                <button
                  type="button"
                  onClick={() => { t.onClick?.(); dismiss(t.id); }}
                  className="flex flex-1 items-start gap-3 px-4 py-3 text-sm font-medium text-left cursor-pointer hover:brightness-110 transition-[filter] duration-[var(--dur-fast)] min-w-0"
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${COLOR[t.type].icon}`}
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={ICON[t.type]} />
                  </svg>
                  <span className="flex-1 leading-snug text-white break-words">{t.message}</span>
                  <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-white/40 self-center ml-2">
                    Open →
                  </span>
                </button>
              ) : (
                <div className="flex flex-1 items-start gap-3 px-4 py-3 text-sm font-medium min-w-0">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${COLOR[t.type].icon}`}
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={ICON[t.type]} />
                  </svg>
                  <span className="flex-1 leading-snug text-white break-words">{t.message}</span>
                </div>
              )}

              {/* ── Dismiss button — always a sibling of body, never nested inside it ── */}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="flex-shrink-0 flex items-center justify-center px-3 opacity-40 hover:opacity-80 transition-opacity text-white border-l border-white/10"
                aria-label="Dismiss notification"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
