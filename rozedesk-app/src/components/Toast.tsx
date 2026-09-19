"use client";
/**
 * Toast — lightweight toast notification system.
 *
 * DRY: one component + one hook for all toasts across the app.
 * Usage:
 *   const toast = useToast();
 *   toast.success("Job posted!");
 *   toast.error("Something went wrong.");
 *   toast.info("Profile updated.");
 *
 * Place <Toaster /> once in the root layout.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id:      string;
  type:    ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  warning: (msg: string) => void;
  info:    (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {}, error: () => {}, warning: () => {}, info: () => {},
});

const ICON: Record<ToastType, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error:   "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const COLOR: Record<ToastType, string> = {
  success: "bg-[color-mix(in_srgb,var(--color-success)_12%,white)] border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] text-[var(--color-success)]",
  error:   "bg-[color-mix(in_srgb,var(--color-error)_8%,white)] border-[color-mix(in_srgb,var(--color-error)_25%,transparent)] text-[var(--color-error)]",
  warning: "bg-[color-mix(in_srgb,var(--color-warning)_8%,white)] border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)] text-[var(--color-warning)]",
  info:    "bg-[color-mix(in_srgb,var(--brand-500)_8%,white)] border-[color-mix(in_srgb,var(--brand-500)_20%,transparent)] text-[var(--brand-500)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    success: (m) => add("success", m),
    error:   (m) => add("error",   m),
    warning: (m) => add("warning", m),
    info:    (m) => add("info",    m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite" aria-label="Notifications">
        {toasts.map(t => (
          <div key={t.id}
            className={[
              "flex items-start gap-3 px-4 py-3 rounded-[var(--radius-xl)] border shadow-[var(--shadow-2)]",
              "text-sm font-medium pointer-events-auto min-w-[280px] max-w-[380px]",
              "animate-[slideInRight_0.25s_ease]",
              COLOR[t.type],
            ].join(" ")}
            role="alert">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICON[t.type]}/>
            </svg>
            <span className="flex-1 leading-snug text-[var(--text-primary)]">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Dismiss">
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2l8 8M10 2l-8 8"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
