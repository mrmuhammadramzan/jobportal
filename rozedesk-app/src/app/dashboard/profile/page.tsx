"use client";
/**
 * /dashboard/profile — Simplified player account settings.
 * Three actions only (per product spec):
 *  1. Change Password  — PUT /api/seeker/profile (or dedicated endpoint)
 *  2. Change Email     — PUT /api/seeker/profile
 *  3. Delete Account   — DELETE /api/seeker/profile (2-step confirm)
 *
 * OOP: useSave hook abstracts the save/error/saved state machine (DRY).
 * Frontend SOP §6.1: all states handled — loading/saving/saved/error.
 * Security: current password required before email or password change.
 * UI/UX SOP §Hard Rule 5: delete is 2-step with typed confirmation.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { safeFetch, ApiError } from "@/lib/api";

/* ── Icon primitive ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Shared input style — full-width, readable on dark bg ── */
const FIELD = [
  "w-full h-11 px-4 rounded-[var(--radius-md)] border",
  "bg-[var(--bg-surface)] border-[var(--border-hover)]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm",
  "outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
  "transition-all duration-[var(--dur-fast)]",
].join(" ");

/* ── Card wrapper — correct palette ── */
function Card({ title, iconPath, children }: { title: string; iconPath: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-default)]">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--brand-500)_18%,transparent)] flex items-center justify-center text-[var(--brand-400)] flex-shrink-0">
          <Icon path={iconPath} className="w-4 h-4"/>
        </div>
        <p className="font-bold text-[var(--text-primary)] text-base leading-tight">{title}</p>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function SaveRow({ saving, saved, error, onClick, label = "Save" }: {
  saving: boolean; saved: boolean; error: string; onClick: () => void; label?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-[var(--border-default)]">
      {error  && <p className="text-xs font-medium text-[var(--color-error)] flex-1 min-w-0 break-words">{error}</p>}
      {saved  && !error && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
          <Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5"/> Saved
        </span>
      )}
      <Button variant="gradient" size="sm" pill loading={saving} onClick={onClick}>{label}</Button>
    </div>
  );
}

/* ── Generic save state hook (DRY) ── */
function useSave() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const run = useCallback(async (fn: () => Promise<void>) => {
    setSaving(true); setSaved(false); setError("");
    try {
      await fn();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }, []);
  return { saving, saved, error, run };
}

/* ── Auth helpers ── */
function authHeaders() {
  const tok = typeof window !== "undefined" ? localStorage.getItem("flappywin-token") ?? "" : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${tok}` } as Record<string, string>;
}

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toast  = useToast();

  /* ── Change Password ── */
  const [curPw,   setCurPw]   = useState("");
  const [newPw,   setNewPw]   = useState("");
  const [confPw,  setConfPw]  = useState("");
  const pwSave = useSave();

  /* ── Change Email ── */
  const [newEmail,  setNewEmail]  = useState("");
  const [emailPw,   setEmailPw]   = useState("");
  const emailSave = useSave();

  /* ── Delete Account ── */
  const [deleteStep,  setDeleteStep]  = useState<0|1|2>(0);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting,    setDeleting]    = useState(false);
  const CONFIRM_WORD = "DELETE";

  /* Pre-fill email field from auth context */
  useEffect(() => {
    if (user?.email) setNewEmail(user.email);
  }, [user]);

  const savePassword = () => pwSave.run(async () => {
    if (!curPw)           throw new Error("Current password is required.");
    if (newPw.length < 8) throw new Error("New password must be at least 8 characters.");
    if (newPw !== confPw) throw new Error("Passwords do not match.");
    await safeFetch("/api/seeker/profile/password", {
      method: "PUT", credentials: "include", headers: authHeaders(),
      body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
    });
    setCurPw(""); setNewPw(""); setConfPw("");
    toast.success("Password updated.");
  });

  const saveEmail = () => emailSave.run(async () => {
    if (!newEmail.trim()) throw new Error("Email is required.");
    if (!emailPw)         throw new Error("Current password is required to change email.");
    await safeFetch("/api/seeker/profile/email", {
      method: "PUT", credentials: "include", headers: authHeaders(),
      body: JSON.stringify({ newEmail: newEmail.trim(), currentPassword: emailPw }),
    });
    setEmailPw("");
    toast.success("Email updated. Please sign in again.");
  });

  const deleteAccount = async () => {
    if (deleteInput !== CONFIRM_WORD) return;
    setDeleting(true);
    try {
      await safeFetch("/api/seeker/profile", {
        method: "DELETE", credentials: "include", headers: authHeaders(),
      });
      /* Clear session */
      localStorage.removeItem("flappywin-token");
      localStorage.removeItem("flappywin-user");
      toast.success("Account deleted.");
      router.push(ROUTES.signIn);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to delete account.");
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-40 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)]"/>)}
      </div>
    );
  }

  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() ?? "FW";

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-500)] flex items-center justify-center text-white font-black text-lg select-none flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-black text-[var(--text-primary)]">{user?.name}</p>
          <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
        </div>
      </div>

      {/* ── Change Password ── */}
      <Card title="Change Password"
        iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cur-pw" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Current Password</label>
            <input id="cur-pw" type="password" value={curPw} onChange={e => setCurPw(e.target.value)}
              className={FIELD} autoComplete="current-password" placeholder="Enter current password"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-pw" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">New Password</label>
              <input id="new-pw" type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className={FIELD} autoComplete="new-password" placeholder="Min 8 chars"/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="conf-pw" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Confirm</label>
              <input id="conf-pw" type="password" value={confPw} onChange={e => setConfPw(e.target.value)}
                className={FIELD} autoComplete="new-password" placeholder="Repeat"/>
            </div>
          </div>
        </div>
        <SaveRow saving={pwSave.saving} saved={pwSave.saved} error={pwSave.error}
          onClick={savePassword} label="Update Password"/>
      </Card>

      {/* ── Change Email ── */}
      <Card title="Change Email"
        iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-email" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">New Email Address</label>
            <input id="new-email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              className={FIELD} autoComplete="email"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-pw" className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Current Password</label>
            <input id="email-pw" type="password" value={emailPw} onChange={e => setEmailPw(e.target.value)}
              className={FIELD} autoComplete="current-password" placeholder="Confirm identity"/>
          </div>
        </div>
        <SaveRow saving={emailSave.saving} saved={emailSave.saved} error={emailSave.error}
          onClick={saveEmail} label="Update Email"/>
      </Card>

      {/* ── Delete Account ── */}
      <div className="rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-error)_4%,transparent)] overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center flex-shrink-0">
            <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              className="w-4 h-4 text-[var(--color-error)]"/>
          </div>
          <p className="font-bold text-[var(--color-error)] text-base">Delete Account</p>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            This permanently deletes your account, wallet, and all game history. This cannot be undone.
          </p>

          {deleteStep === 0 && (
            <button type="button" onClick={() => setDeleteStep(1)}
              className="self-start px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-colors">
              Delete My Account
            </button>
          )}

          {deleteStep === 1 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-[var(--color-error)]">
                Type <span className="font-black tracking-widest">{CONFIRM_WORD}</span> to confirm:
              </p>
              <input type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                className={FIELD} placeholder={CONFIRM_WORD} aria-label={`Type ${CONFIRM_WORD} to confirm deletion`}/>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setDeleteStep(0); setDeleteInput(""); }}
                  className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--text-muted)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={deleteAccount} disabled={deleteInput !== CONFIRM_WORD || deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold text-white bg-[var(--color-error)] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {deleting ? "Deleting…" : "Permanently Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
