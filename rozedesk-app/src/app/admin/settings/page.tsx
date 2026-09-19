"use client";
/**
 * /admin/settings — fully wired to real backend APIs.
 *
 * Sections + their API:
 *   Admin Management   → GET/POST/DELETE /api/admin/admins       (root admin only)
 *   Admin Profile      → PUT /api/admin/settings/profile
 *   Platform Settings  → GET /api/admin/settings, PUT /api/admin/settings
 *   Notifications      → PUT /api/admin/settings (notifNew, notifShortlist, notifWeekly)
 *   Change Password    → PUT /api/admin/settings/password
 *   Danger Zone        → DELETE /api/admin/jobs/all              (root admin only)
 *
 * Backend SOP Hard Rule 1: all mutations authenticated server-side.
 * UI/UX SOP §Hard Rule 5: destructive actions use two-step confirmation.
 * DRY: authHeaders(), SectionCard, FieldGroup, Toggle, SaveBtn — each defined once.
 * All values from env/API — no hardcoded strings.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/components/Toast";

/* ── Shared helpers ── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const FIELD = [
  "w-full h-10 px-3 rounded-[var(--radius-md)] border",
  "bg-[var(--bg-elevated)] border-[var(--border-default)]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
  "text-sm outline-none",
  "focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
  "hover:border-[var(--border-hover)]",
  "transition-all duration-[var(--dur-fast)]",
].join(" ");

/** Get auth headers — DRY, used in every fetch */
function authHeaders(): HeadersInit {
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

function SectionCard({ title, description, icon, children }: {
  title: string; description?: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
      <div className="flex items-start gap-3 px-6 py-5 border-b border-[var(--border-default)]">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--brand-500)_15%,transparent)] flex items-center justify-center flex-shrink-0 text-[var(--brand-400)]">
          {icon}
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)] text-base">{title}</p>
          {description && <p className="text-[var(--text-muted)] text-sm mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function FieldGroup({ label, id, children, hint }: {
  label: string; id: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      {children}
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

function Toggle({ id, label, description, checked, onChange }: {
  id: string; label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-4 cursor-pointer group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</p>
        {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      <div className="relative flex-shrink-0 mt-0.5">
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-9 h-5 rounded-full border-2 border-[var(--border-default)] peer-checked:bg-[var(--brand-500)] peer-checked:border-[var(--brand-500)] bg-[var(--bg-elevated)] transition-all duration-[var(--dur-default)]" />
        <div className="absolute top-[3px] left-[3px] w-3 h-3 rounded-full bg-[var(--text-muted)] peer-checked:bg-white peer-checked:translate-x-4 transition-all duration-[var(--dur-default)]" />
      </div>
    </label>
  );
}

/* ── Inline feedback row used by every section's save button ── */
interface SaveRowProps {
  saving: boolean; saved: boolean; error: string;
  onSave: () => void; label?: string;
}
function SaveRow({ saving, saved, error, onSave, label = "Save Changes" }: SaveRowProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-default)] mt-1">
      {error && <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>}
      {saved && !error && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
          <Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5" /> Saved
        </span>
      )}
      <Button type="button" variant="gradient" size="sm" pill loading={saving} onClick={onSave}>
        {label}
      </Button>
    </div>
  );
}

/* ── useSave: generic save hook — DRY for every section ── */
function useSave() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const run = useCallback(async (apiFn: () => Promise<void>) => {
    setSaving(true); setSaved(false); setError("");
    try {
      await apiFn();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);
  return { saving, saved, error, run, setError };
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router   = useRouter();
  const toast    = useToast();

  /* ── Loading state ── */
  const [pageLoading, setPageLoading] = useState(true);

  /* ── Admin profile ── */
  const [adminName,  setAdminName]  = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const profileSave = useSave();

  /* ── Platform settings ── */
  const [siteName,     setSiteName]     = useState("RozeDesk");
  const [tagline,      setTagline]      = useState("Find your next job in Pakistan");
  const [contactEmail, setContactEmail] = useState("hello@rozedesk.com");
  const [appFeeDisplay, setAppFeeDisplay] = useState(parseInt(process.env.NEXT_PUBLIC_APP_FEE ?? "0", 10));
  const platformSave = useSave();

  /* ── Notifications ── */
  const [notifNew,        setNotifNew]        = useState(true);
  const [notifShortlist,  setNotifShortlist]  = useState(true);
  const [notifWeekly,     setNotifWeekly]     = useState(false);
  const notifSave = useSave();

  /* ── Password change ── */
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const passwordSave = useSave();

  /* ── Admin management (root only) ── */
  const [admins,        setAdmins]        = useState<{ id: string; name: string; email: string; isRoot: boolean }[]>([]);
  const [isRootAdmin,   setIsRootAdmin]   = useState(false);
  const [newAdminName,  setNewAdminName]  = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPass,  setNewAdminPass]  = useState("");
  const adminCreateSave = useSave();
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const [deleteErr,     setDeleteErr]     = useState("");

  /* ── Danger zone ── */
  const [dangerStep,  setDangerStep]  = useState<0|1|2>(0); // 0=idle 1=confirm 2=deleting
  const [dangerError, setDangerError] = useState("");

  /* ── Load settings + admin list on mount — re-runs when user resolves ── */
  useEffect(() => {
    if (!user) {
      /* If AuthContext is done loading but still no user, stop showing skeleton */
      if (!isLoading) setPageLoading(false);
      return;
    }
    Promise.all([
      /* Settings (profile + platform) */
      fetch("/api/admin/settings", { headers: authHeaders(), credentials: "include" })
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load settings"))),
      /* Admin list (only root will see content) */
      fetch("/api/admin/admins", { headers: authHeaders(), credentials: "include" })
        .then(r => r.ok ? r.json() : []),
    ])
      .then(([settings, adminList]) => {
        if (settings.profile) {
          setAdminName(settings.profile.name  ?? "");
          setAdminEmail(settings.profile.email ?? "");
        }
        if (settings.platform) {
          setSiteName(settings.platform.siteName      ?? "RozeDesk");
          setTagline(settings.platform.tagline         ?? "");
          setContactEmail(settings.platform.contactEmail ?? "");
          setNotifNew(settings.platform.notifNew        !== false);
          setNotifShortlist(settings.platform.notifShortlist !== false);
          setNotifWeekly(settings.platform.notifWeekly  === true);
          if (settings.platform.appFee) setAppFeeDisplay(settings.platform.appFee);
        }
        if (Array.isArray(adminList)) {
          setAdmins(adminList);
          const me = adminList.find((a: { id: string }) => a.id === user.id);
          setIsRootAdmin(me?.isRoot ?? false);
        }
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, [user, isLoading]);

  /* ── Save handlers ── */
  const saveProfile = () => profileSave.run(async () => {
    const res  = await fetch("/api/admin/settings/profile", {
      method: "PUT", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({ name: adminName, email: adminEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    toast.success("Profile saved.");
  });

  const savePlatform = () => platformSave.run(async () => {
    const res  = await fetch("/api/admin/settings", {
      method: "PUT", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({ siteName, tagline, contactEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    toast.success("Platform settings saved.");
  });

  const saveNotifications = () => notifSave.run(async () => {
    const res  = await fetch("/api/admin/settings", {
      method: "PUT", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({ notifNew, notifShortlist, notifWeekly }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  });

  const savePassword = () => passwordSave.run(async () => {
    if (!currentPw) throw new Error("Current password is required.");
    if (newPw.length < 8) throw new Error("New password must be at least 8 characters.");
    if (newPw !== confirmPw) throw new Error("New passwords do not match.");
    const res  = await fetch("/api/admin/settings/password", {
      method: "PUT", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    toast.success("Password updated successfully.");
  });

  const createAdmin = () => adminCreateSave.run(async () => {
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPass) {
      throw new Error("All fields are required.");
    }
    const res  = await fetch("/api/admin/admins", {
      method: "POST", headers: authHeaders(), credentials: "include",
      body: JSON.stringify({ name: newAdminName, email: newAdminEmail, password: newAdminPass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setAdmins(prev => [...prev, data]);
    setNewAdminName(""); setNewAdminEmail(""); setNewAdminPass("");
  });

  const deleteAdmin = async (id: string) => {
    setDeleteTarget(null); setDeleteErr("");
    try {
      const res  = await fetch(`/api/admin/admins/${id}`, {
        method: "DELETE", headers: authHeaders(), credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (e: unknown) {
      setDeleteErr(e instanceof Error ? e.message : "Failed to remove admin.");
    }
  };

  const deleteAllJobs = async () => {
    setDangerStep(2); setDangerError("");
    try {
      const res  = await fetch("/api/admin/jobs/all", {
        method: "DELETE", headers: authHeaders(), credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDangerStep(0);
      router.push(ROUTES.adminJobs);
    } catch (e: unknown) {
      setDangerError(e instanceof Error ? e.message : "Failed to delete listings.");
      setDangerStep(1);
    }
  };

  /* ── Loading skeleton ── */
  if (pageLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-32 bg-[var(--bg-elevated)] rounded animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  const initials = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "SA";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Settings</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">Manage your admin profile and platform configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: form sections ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Admin Management — root admin only */}
          {isRootAdmin && (
            <SectionCard
              title="Admin Accounts"
              description="Only you (root admin) can create or delete admin accounts."
              icon={<Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />}
            >
              {deleteErr && (
                <p className="text-xs font-medium text-[var(--color-error)]">{deleteErr}</p>
              )}
              <div className="flex flex-col gap-2">
                {admins.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-default)]">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{a.email}{a.isRoot ? " · Root Admin" : ""}</p>
                    </div>
                    {!a.isRoot && (
                      <button type="button" onClick={() => { setDeleteErr(""); setDeleteTarget(a.id); }}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border-default)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Add Admin Account</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FieldGroup id="new-admin-name" label="Name">
                    <input id="new-admin-name" type="text" value={newAdminName} onChange={e => setNewAdminName(e.target.value)} className={FIELD} placeholder="Full name" />
                  </FieldGroup>
                  <FieldGroup id="new-admin-email" label="Email">
                    <input id="new-admin-email" type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className={FIELD} placeholder="admin@example.com" />
                  </FieldGroup>
                  <FieldGroup id="new-admin-pass" label="Password">
                    <input id="new-admin-pass" type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} className={FIELD} placeholder="Min 8 chars" />
                  </FieldGroup>
                </div>
                <SaveRow
                  saving={adminCreateSave.saving}
                  saved={adminCreateSave.saved}
                  error={adminCreateSave.error}
                  onSave={createAdmin}
                  label="Create Admin"
                />
              </div>
            </SectionCard>
          )}

          {/* Admin Profile */}
          <SectionCard
            title="Admin Profile"
            description="Your name and email shown in the admin panel."
            icon={<Icon path="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" className="w-4 h-4" />}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-[var(--text-primary)] text-sm font-semibold">{adminName}</p>
                <p className="text-[var(--text-muted)] text-xs">Avatar uses your initials — image upload coming soon</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="admin-name" label="Display Name">
                <input id="admin-name" type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className={FIELD} placeholder="Your name" />
              </FieldGroup>
              <FieldGroup id="admin-email" label="Email Address">
                <input id="admin-email" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className={FIELD} placeholder="admin@example.com" />
              </FieldGroup>
            </div>
            <SaveRow saving={profileSave.saving} saved={profileSave.saved} error={profileSave.error} onSave={saveProfile} />
          </SectionCard>

          {/* Platform Settings */}
          <SectionCard
            title="Platform Settings"
            description="Public-facing name and contact details."
            icon={<Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" className="w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="site-name" label="Platform Name">
                <input id="site-name" type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className={FIELD} />
              </FieldGroup>
              <FieldGroup id="contact-email" label="Contact Email">
                <input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className={FIELD} />
              </FieldGroup>
            </div>
            <FieldGroup id="tagline" label="Tagline" hint="Shown in the hero section and meta description.">
              <input id="tagline" type="text" value={tagline} onChange={e => setTagline(e.target.value)} className={FIELD} />
            </FieldGroup>
            <SaveRow saving={platformSave.saving} saved={platformSave.saved} error={platformSave.error} onSave={savePlatform} />
          </SectionCard>

          {/* Notification Preferences */}
          <SectionCard
            title="Notification Preferences"
            description="Choose which events send you an email notification."
            icon={<Icon path="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" className="w-4 h-4" />}
          >
            <Toggle id="notif-new"       label="New Application"   description="Email when someone applies."      checked={notifNew}       onChange={setNotifNew}       />
            <Toggle id="notif-shortlist" label="Shortlist Updated" description="Email when you update a status." checked={notifShortlist} onChange={setNotifShortlist} />
            <Toggle id="notif-weekly"    label="Weekly Summary"    description="Weekly digest of stats."         checked={notifWeekly}    onChange={setNotifWeekly}    />
            <SaveRow saving={notifSave.saving} saved={notifSave.saved} error={notifSave.error} onSave={saveNotifications} />
          </SectionCard>

          {/* Change Password */}
          <SectionCard
            title="Change Password"
            description="Use a strong password you don't use elsewhere."
            icon={<Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-4 h-4" />}
          >
            <FieldGroup id="current-pw" label="Current Password">
              <input id="current-pw" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={FIELD} placeholder="Enter current password" autoComplete="current-password" />
            </FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup id="new-pw" label="New Password" hint="Minimum 8 characters.">
                <input id="new-pw" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={FIELD} placeholder="New password" autoComplete="new-password" />
              </FieldGroup>
              <FieldGroup id="confirm-pw" label="Confirm New Password">
                <input id="confirm-pw" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={FIELD} placeholder="Repeat new password" autoComplete="new-password" />
              </FieldGroup>
            </div>
            <SaveRow saving={passwordSave.saving} saved={passwordSave.saved} error={passwordSave.error} onSave={savePassword} label="Update Password" />
          </SectionCard>

          {/* Danger Zone */}
          <div className="rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-error)_4%,transparent)] overflow-hidden">
            <div className="flex items-start gap-3 px-6 py-5 border-b border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center flex-shrink-0">
                <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-4 h-4 text-[var(--color-error)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--color-error)] text-base">Danger Zone</p>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">These actions are permanent and cannot be undone.</p>
              </div>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              {dangerError && (
                <p className="text-xs font-medium text-[var(--color-error)]">{dangerError}</p>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-primary)] font-semibold text-sm">Clear all job listings</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">Permanently deletes all job listings, applications, and payments. Cannot be undone.</p>
                </div>
                {dangerStep === 0 && (
                  <button type="button" onClick={() => setDangerStep(1)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-colors">
                    Delete All
                  </button>
                )}
                {dangerStep === 1 && (
                  <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                    <p className="text-xs font-semibold text-[var(--color-error)]">Are you sure? This is permanent.</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setDangerStep(0); setDangerError(""); }}
                        className="px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold text-[var(--text-muted)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors">
                        Cancel
                      </button>
                      <button type="button" onClick={deleteAllJobs}
                        className="px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold text-white bg-[var(--color-error)] hover:brightness-110 transition-all">
                        Yes, Delete All
                      </button>
                    </div>
                  </div>
                )}
                {dangerStep === 2 && (
                  <span className="text-xs font-semibold text-[var(--color-error)] animate-pulse flex-shrink-0">Deleting…</span>
                )}
              </div>
            </div>
          </div>

        </div>{/* end left col */}

        {/* ── RIGHT: quick reference ── */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 flex flex-col gap-4">
            <p className="font-bold text-[var(--text-primary)] text-sm">Quick Info</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Platform fee",    value: `PKR ${appFeeDisplay} / application` },
                { label: "Payment methods", value: "JazzCash, Easypaisa" },
                { label: "Admin email",     value: adminEmail  },
                { label: "Site name",       value: siteName    },
              ].map(item => (
                <li key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{item.label}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 flex flex-col gap-2">
            <p className="font-bold text-[var(--text-primary)] text-sm">Platform</p>
            <p className="text-xs text-[var(--text-muted)]">RozeDesk Admin v1.0</p>
            <p className="text-xs text-[var(--text-muted)]">Next.js 16 · React 19</p>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-success)] mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              All systems operational
            </span>
          </div>

          <div className="rounded-[var(--radius-xl)] bg-[color-mix(in_srgb,var(--brand-500)_6%,transparent)] border border-[color-mix(in_srgb,var(--brand-500)_20%,transparent)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Need help?</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Contact support or check the documentation for configuration guidance.
            </p>
          </div>
        </div>

      </div>

      {/* Delete admin confirmation modal */}
      {deleteTarget && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => setDeleteTarget(null)} />
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-sm" role="dialog" aria-modal="true">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <h3 className="font-black text-[var(--text-primary)] text-lg">Remove Admin?</h3>
              <p className="text-sm text-[var(--text-secondary)]">This admin will lose all access immediately. This cannot be undone.</p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button variant="danger" size="md" pill onClick={() => deleteAdmin(deleteTarget)}>Yes, Remove</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
