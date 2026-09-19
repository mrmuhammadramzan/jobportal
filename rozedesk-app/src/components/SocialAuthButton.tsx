/**
 * SocialAuthButton — OAuth provider button. Google only (GitHub removed).
 *
 * DRY: one component drives all OAuth buttons via `provider` prop.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens, no raw hex.
 * Accessibility: aria-label describes full action, aria-busy during loading.
 */
import React from "react";

type Provider = "google";

interface SocialAuthButtonProps {
  provider: Provider;
  action?: "signin" | "signup";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const PROVIDER_CONFIG: Record<Provider, { label: string; icon: React.ReactNode; className: string }> = {
  google: {
    label: "Google",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    className:
      "bg-[var(--bg-base)] border-[var(--border-default)] text-[var(--text-primary)] " +
      "hover:bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]",
  },
};

function Spinner() {
  return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" aria-hidden="true" />;
}

export default function SocialAuthButton({
  provider,
  action = "signin",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}: SocialAuthButtonProps) {
  const config     = PROVIDER_CONFIG[provider];
  const isDisabled = disabled || loading;
  const verb       = action === "signup" ? "Sign up" : "Sign in";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`${verb} with ${config.label}`}
      aria-busy={loading}
      className={[
        "relative w-full h-11 flex items-center justify-center gap-3",
        "rounded-[var(--radius-md)] border font-medium text-[var(--text-sm)]",
        "transition-all duration-[var(--dur-default)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2",
        "active:scale-[0.97]",
        config.className,
        isDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className,
      ].filter(Boolean).join(" ")}
    >
      {loading ? <Spinner /> : config.icon}
      <span className={loading ? "opacity-0" : ""}>{verb} with {config.label}</span>
    </button>
  );
}
