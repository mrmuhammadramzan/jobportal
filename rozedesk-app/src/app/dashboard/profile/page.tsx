"use client";
/**
 * /dashboard/profile — Full seeker profile with all sections.
 *
 * Sections:
 *  1. Completeness bar
 *  2. Personal Information (name, email, phone, location, summary)
 *  3. Skills (tag input)
 *  4. Education (dynamic entries: Matric/O-Levels → 12yr → 14yr → 16yr → 18yr)
 *  5. Work Experience (dynamic entries)
 *  6. Current Project
 *  7. Links (LinkedIn, GitHub, Portfolio)
 *  8. Job Preferences
 *  9. Live CV Preview
 * 10. Danger Zone
 *
 * Frontend SOP §6.1: loading / error / populated states.
 * Frontend SOP §7: every input has a visible label.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * UI/UX SOP §Hard Rule 5: delete requires two-step confirmation.
 * DRY: token(), SectionCard, SaveBtn, Field, SelectField — each defined once.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { signOut } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/components/Toast";

/* ── Helpers ── */
function token() {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}
function authHeaders(json = true): HeadersInit {
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token()}`,
  };
}

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const TA = "w-full px-3 py-2.5 rounded-[var(--radius-md)] border bg-[var(--bg-base)] border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all resize-none";
const INP = "h-10 px-3 rounded-[var(--radius-md)] border bg-[var(--bg-elevated)] border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all w-full";
const SEL = `${INP} appearance-none cursor-pointer`;

function Field({ id, label, required, children }: { id: string; label: string | React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}{required && <span className="text-[var(--color-error)] ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  return (
    <Field id={id} label={label}>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className={SEL}>
        <option value="">Select…</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function SectionCard({ title, icon, children, completePct }: {
  title: string; icon: string; children: React.ReactNode; completePct?: number;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] flex items-center justify-center flex-shrink-0">
            <Icon path={icon} className="w-4 h-4 text-[var(--brand-500)]" />
          </div>
          <p className="font-bold text-[var(--text-primary)] text-base">{title}</p>
        </div>
        {completePct !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${completePct === 100 ? "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)]" : "bg-[var(--bg-base)] text-[var(--text-muted)]"}`}>
            {completePct === 100 ? "✓ Complete" : `${completePct}%`}
          </span>
        )}
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

/* ── Types ── */
interface EducationEntry {
  level: string; institution: string; board: string;
  totalMarks: string; obtainedMarks: string; year: string; grade: string;
}
interface ExperienceEntry {
  company: string; title: string; startDate: string; endDate: string;
  current: boolean; description: string;
}
interface Completeness { pct: number; canApply: boolean; missing: string[]; }

const EDU_LEVELS = ["Matric / O-Levels", "Intermediate / A-Levels", "Bachelor's (14yr)", "Bachelor's (16yr)", "Master's (18yr)", "PhD", "Diploma / Certificate"];
const EDU_FIELDS_BY_LEVEL: Record<string, string[]> = {
  "Matric / O-Levels":       ["institution","board","totalMarks","obtainedMarks","year"],
  "Intermediate / A-Levels": ["institution","board","totalMarks","obtainedMarks","year"],
  "Bachelor's (14yr)":       ["institution","totalMarks","obtainedMarks","year","grade"],
  "Bachelor's (16yr)":       ["institution","totalMarks","obtainedMarks","year","grade"],
  "Master's (18yr)":         ["institution","totalMarks","obtainedMarks","year","grade"],
  "PhD":                     ["institution","year","grade"],
  "Diploma / Certificate":   ["institution","year"],
};
const JOB_TYPES    = ["Full-time","Part-time","Contract","Remote","Internship"];
const REMOTE_PREFS = ["On-site only","Remote preferred","Remote only","Flexible"];
const TECH_KEYWORDS = ["developer","engineer","programmer","software","frontend","backend","fullstack","devops","data","ai","ml","cyber","tech","it ","qa","testing","mobile","react","node","python","java","cloud"];

export default function ProfilePage() {
  const router = useRouter();
  const toast  = useToast();

  /* ── Remote state ── */
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [completeness, setCompleteness] = useState<Completeness | null>(null);

  /* ── Section save state ── */
  const [saving,  setSaving]  = useState<Record<string, boolean>>({});
  const [saved,   setSaved]   = useState<Record<string, boolean>>({});
  const [saveErr, setSaveErr] = useState<Record<string, string>>({});

  /* ── Personal ── */
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [location, setLocation] = useState("");
  const [summary,  setSummary]  = useState("");

  /* ── Skills ── */
  const [skills,     setSkills]     = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  /* ── Education ── */
  const [education, setEducation] = useState<EducationEntry[]>([]);

  /* ── Experience ── */
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);

  /* ── Current project ── */
  const [currentProject, setCurrentProject] = useState("");

  /* ── Links ── */
  const [linkedin,  setLinkedin]  = useState("");
  const [github,    setGithub]    = useState("");
  const [portfolio, setPortfolio] = useState("");

  /* ── Preferences ── */
  const [jobType,       setJobType]       = useState("Full-time");
  const [desiredSalary, setDesiredSalary] = useState("");
  const [remotePref,    setRemotePref]    = useState("Remote preferred");

  /* ── Delete ── */
  const [deleteStep,  setDeleteStep]  = useState<0|1|2>(0);
  const [deleteError, setDeleteError] = useState("");

  /* Is tech role? — auto-detect from skills/job title */
  const isTechRole = skills.some(s =>
    TECH_KEYWORDS.some(k => s.toLowerCase().includes(k))
  );

  /* ── Load profile on mount ── */
  useEffect(() => {
    Promise.all([
      fetch("/api/seeker/profile",             { credentials:"include", headers: authHeaders(false) }).then(r => r.ok ? r.json() : null),
      fetch("/api/seeker/profile/completeness", { credentials:"include", headers: authHeaders(false) }).then(r => r.ok ? r.json() : null),
    ]).then(([data, comp]) => {
      if (data) {
        setName(data.name ?? ""); setEmail(data.email ?? "");
        setPhone(data.phone ?? ""); setLocation(data.location ?? "");
        setSummary(data.summary ?? "");
        setSkills(data.skills ?? []);
        setLinkedin(data.linkedin ?? ""); setGithub(data.github ?? ""); setPortfolio(data.portfolio ?? "");
        setEducation(data.education ?? []);
        setExperience(data.experience ?? []);
        setCurrentProject(data.currentProject ?? "");
        setJobType(data.jobType ?? "Full-time");
        setDesiredSalary(data.desiredSalary ?? "");
        setRemotePref(data.remotePref ?? "Remote preferred");
      }
      if (comp) setCompleteness(comp);
    })
    .catch(() => setError("Could not load your profile. Please refresh."))
    .finally(() => setLoading(false));
  }, []);

  /* ── Save section ── */
  const save = useCallback(async (section: string, body: Record<string, unknown>) => {
    setSaving(p => ({ ...p, [section]: true }));
    setSaveErr(p => ({ ...p, [section]: "" }));
    try {
      const res  = await fetch("/api/seeker/profile", {
        method: "PUT", headers: authHeaders(), credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setSaved(p => ({ ...p, [section]: true }));
      setTimeout(() => setSaved(p => ({ ...p, [section]: false })), 2500);
      toast.success("Saved successfully.");
      /* Refresh completeness after save */
      fetch("/api/seeker/profile/completeness", { credentials:"include", headers: authHeaders(false) })
        .then(r => r.ok ? r.json() : null).then(c => { if (c) setCompleteness(c); }).catch(() => {});
    } catch (e: unknown) {
      setSaveErr(p => ({ ...p, [section]: e instanceof Error ? e.message : "Save failed." }));
    } finally {
      setSaving(p => ({ ...p, [section]: false }));
    }
  }, []);

  /* ── Delete account ── */
  const deleteAccount = useCallback(async () => {
    setDeleteStep(2); setDeleteError("");
    try {
      const res = await fetch("/api/seeker/profile", { method:"DELETE", headers: authHeaders(false), credentials:"include" });
      if (!res.ok) throw new Error((await res.json()).message ?? "Failed.");
      signOut(); router.push(ROUTES.home);
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete account.");
      setDeleteStep(1);
    }
  }, [router]);

  function SaveBtn({ section, body }: { section: string; body: Record<string, unknown> }) {
    return (
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-default)]">
        {saveErr[section] && <span className="text-xs font-medium text-[var(--color-error)] flex-1">{saveErr[section]}</span>}
        {saved[section]   && <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]"><Icon path="M20 6L9 17l-5-5" className="w-3.5 h-3.5"/>Saved</span>}
        <Button variant="gradient" size="sm" pill loading={saving[section]} onClick={() => save(section, body)}>Save Changes</Button>
      </div>
    );
  }

  /* ── Education helpers ── */
  function addEdu() {
    setEducation(prev => [...prev, { level:"Matric / O-Levels", institution:"", board:"", totalMarks:"", obtainedMarks:"", year:"", grade:"" }]);
  }
  function updateEdu(i: number, k: keyof EducationEntry, v: string) {
    setEducation(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  }
  function removeEdu(i: number) { setEducation(prev => prev.filter((_, idx) => idx !== i)); }

  /* ── Experience helpers ── */
  function addExp() {
    setExperience(prev => [...prev, { company:"", title:"", startDate:"", endDate:"", current:false, description:"" }]);
  }
  function updateExp(i: number, k: keyof ExperienceEntry, v: string | boolean) {
    setExperience(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  }
  function removeExp(i: number) { setExperience(prev => prev.filter((_, idx) => idx !== i)); }

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="h-8 w-48 bg-[var(--bg-elevated)] rounded animate-pulse" />
        {[1,2,3].map(i => (
          <div key={i} className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] max-w-3xl">
        <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-error)]"/>
        <p className="font-semibold text-[var(--text-primary)]">{error}</p>
        <Button variant="outline" size="md" pill onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">My Profile</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">Complete your profile to unlock job applications.</p>
      </div>

      {/* ── Completeness bar ── */}
      {completeness && (
        <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm">Profile Completeness</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {completeness.canApply
                  ? "✓ You can apply for jobs"
                  : `Complete ${60 - completeness.pct}% more to unlock applications`}
              </p>
            </div>
            <span className={`text-2xl font-black ${completeness.pct >= 80 ? "text-[var(--color-success)]" : completeness.pct >= 60 ? "text-[var(--color-warning)]" : "text-[var(--color-error)]"}`}>
              {completeness.pct}%
            </span>
          </div>
          <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completeness.pct}%`,
                background: completeness.pct >= 80 ? "var(--color-success)" : completeness.pct >= 60 ? "var(--color-warning)" : "var(--color-error)",
              }}/>
          </div>
          {completeness.missing.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {completeness.missing.map(m => (
                <span key={m} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-default)]">
                  Missing: {m}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Avatar ── */}
      <div className="flex items-center gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)] text-base">{name || "Your Name"}</p>
          <p className="text-[var(--text-muted)] text-sm">{email}</p>
        </div>
      </div>

      {/* ── 1. Personal Information ── */}
      <SectionCard title="Personal Information" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="p-name"  label="Full Name"     required><input id="p-name"  type="text"  value={name}     onChange={e=>setName(e.target.value)}     className={INP} placeholder="Your full name"/></Field>
          <Field id="p-email" label="Email Address" required><input id="p-email" type="email" value={email}    onChange={e=>setEmail(e.target.value)}    className={INP} placeholder="you@example.com"/></Field>
          <Field id="p-phone" label="Phone Number"><input id="p-phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className={INP} placeholder="+92 300 1234567"/></Field>
          <Field id="p-loc"   label="City, Country"><input id="p-loc" type="text" value={location} onChange={e=>setLocation(e.target.value)} className={INP} placeholder="Lahore, Pakistan"/></Field>
        </div>
        <Field id="p-summary" label="Professional Summary">
          <textarea id="p-summary" rows={3} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Brief description of your experience and goals…" className={TA}/>
        </Field>
        <SaveBtn section="personal" body={{ name, email, phone, location, summary }}/>
      </SectionCard>

      {/* ── 2. Skills ── */}
      <SectionCard title="Skills" icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] text-xs font-semibold border border-[var(--brand-200)]">
                {s}
                <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))} aria-label={`Remove ${s}`}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[var(--brand-200)] flex items-center justify-center">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l8 8M10 2l-8 8"/></svg>
                </button>
              </span>
            ))}
          </div>
        )}
        <Field id="skill-input" label="Add Skill">
          <input id="skill-input" type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => {
              if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
                e.preventDefault();
                const tag = skillInput.trim().replace(/,$/, "");
                if (tag && !skills.includes(tag)) setSkills(prev => [...prev, tag]);
                setSkillInput("");
              }
            }}
            placeholder="Type a skill and press Enter…" className={INP}/>
          <p className="text-xs text-[var(--text-muted)]">Press Enter or comma to add.</p>
        </Field>
        <SaveBtn section="skills" body={{ skills }}/>
      </SectionCard>

      {/* ── 3. Education ── */}
      <SectionCard title="Education" icon="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z">
        {education.map((edu, i) => {
          const fields = EDU_FIELDS_BY_LEVEL[edu.level] ?? [];
          return (
            <div key={i} className="flex flex-col gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)] relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Education #{i+1}</p>
                <button type="button" onClick={() => removeEdu(i)}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors">Remove</button>
              </div>
              <SelectField id={`edu-level-${i}`} label="Qualification Level" value={edu.level} onChange={v => updateEdu(i,"level",v)} options={EDU_LEVELS}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id={`edu-inst-${i}`} label="Institution / University" required>
                  <input id={`edu-inst-${i}`} type="text" value={edu.institution} onChange={e=>updateEdu(i,"institution",e.target.value)} className={INP} placeholder="e.g. Punjab University"/>
                </Field>
                {fields.includes("board") && (
                  <Field id={`edu-board-${i}`} label="Board Name">
                    <input id={`edu-board-${i}`} type="text" value={edu.board} onChange={e=>updateEdu(i,"board",e.target.value)} className={INP} placeholder="e.g. BISE Lahore"/>
                  </Field>
                )}
                <Field id={`edu-year-${i}`} label="Passing Year">
                  <input id={`edu-year-${i}`} type="text" value={edu.year} onChange={e=>updateEdu(i,"year",e.target.value)} className={INP} placeholder="e.g. 2022"/>
                </Field>
                {fields.includes("totalMarks") && (
                  <Field id={`edu-total-${i}`} label="Total Marks">
                    <input id={`edu-total-${i}`} type="number" value={edu.totalMarks} onChange={e=>updateEdu(i,"totalMarks",e.target.value)} className={INP} placeholder="e.g. 1100"/>
                  </Field>
                )}
                {fields.includes("obtainedMarks") && (
                  <Field id={`edu-obtained-${i}`} label="Obtained Marks">
                    <input id={`edu-obtained-${i}`} type="number" value={edu.obtainedMarks} onChange={e=>updateEdu(i,"obtainedMarks",e.target.value)} className={INP} placeholder="e.g. 950"/>
                  </Field>
                )}
                {fields.includes("grade") && (
                  <Field id={`edu-grade-${i}`} label="Grade / CGPA">
                    <input id={`edu-grade-${i}`} type="text" value={edu.grade} onChange={e=>updateEdu(i,"grade",e.target.value)} className={INP} placeholder="e.g. A+ or 3.8"/>
                  </Field>
                )}
              </div>
            </div>
          );
        })}
        <button type="button" onClick={addEdu}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors w-fit">
          <Icon path="M12 4v16m8-8H4" className="w-4 h-4"/> Add Education
        </button>
        <SaveBtn section="education" body={{ education }}/>
      </SectionCard>

      {/* ── 4. Work Experience ── */}
      <SectionCard title="Work Experience" icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
        {experience.map((exp, i) => (
          <div key={i} className="flex flex-col gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Experience #{i+1}</p>
              <button type="button" onClick={() => removeExp(i)}
                className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--color-error)] transition-colors">Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field id={`exp-co-${i}`} label="Company / Organisation" required>
                <input id={`exp-co-${i}`} type="text" value={exp.company} onChange={e=>updateExp(i,"company",e.target.value)} className={INP} placeholder="e.g. Systems Ltd"/>
              </Field>
              <Field id={`exp-title-${i}`} label="Job Title" required>
                <input id={`exp-title-${i}`} type="text" value={exp.title} onChange={e=>updateExp(i,"title",e.target.value)} className={INP} placeholder="e.g. React Developer"/>
              </Field>
              <Field id={`exp-start-${i}`} label="Start Date">
                <input id={`exp-start-${i}`} type="month" value={exp.startDate} onChange={e=>updateExp(i,"startDate",e.target.value)} className={INP}/>
              </Field>
              {!exp.current && (
                <Field id={`exp-end-${i}`} label="End Date">
                  <input id={`exp-end-${i}`} type="month" value={exp.endDate} onChange={e=>updateExp(i,"endDate",e.target.value)} className={INP}/>
                </Field>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" checked={exp.current} onChange={e=>updateExp(i,"current",e.target.checked)} className="w-4 h-4 accent-[var(--brand-500)]"/>
              <span className="text-sm text-[var(--text-secondary)]">Currently working here</span>
            </label>
            <Field id={`exp-desc-${i}`} label="Description">
              <textarea id={`exp-desc-${i}`} rows={3} value={exp.description} onChange={e=>updateExp(i,"description",e.target.value)}
                placeholder="Key responsibilities and achievements…" className={TA}/>
            </Field>
          </div>
        ))}
        <button type="button" onClick={addExp}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors w-fit">
          <Icon path="M12 4v16m8-8H4" className="w-4 h-4"/> Add Experience
        </button>
        <SaveBtn section="experience" body={{ experience }}/>
      </SectionCard>

      {/* ── 5. Current Project ── */}
      <SectionCard title="Current Project" icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4">
        <Field id="proj" label="Describe your current project or recent work">
          <textarea id="proj" rows={4} value={currentProject} onChange={e=>setCurrentProject(e.target.value)}
            placeholder="What are you building or working on right now? Describe the tech stack, your role, and impact…" className={TA}/>
        </Field>
        <SaveBtn section="project" body={{ currentProject }}/>
      </SectionCard>

      {/* ── 6. Links ── */}
      <SectionCard title="Professional Links" icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
        <Field id="linkedin" label={<span className="flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>LinkedIn</span>}>
          <input id="linkedin" type="url" value={linkedin} onChange={e=>setLinkedin(e.target.value)} className={INP} placeholder="https://linkedin.com/in/yourprofile"/>
        </Field>
        {isTechRole && (
          <>
            <Field id="github" label={<span className="flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>GitHub</span>}>
              <input id="github" type="url" value={github} onChange={e=>setGithub(e.target.value)} className={INP} placeholder="https://github.com/yourusername"/>
            </Field>
            <Field id="portfolio" label={<span className="flex items-center gap-1.5"><Icon path="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" className="w-4 h-4"/>Portfolio</span>}>
              <input id="portfolio" type="url" value={portfolio} onChange={e=>setPortfolio(e.target.value)} className={INP} placeholder="https://yourportfolio.com"/>
            </Field>
          </>
        )}
        {!isTechRole && (
          <Field id="portfolio-gen" label={<span className="flex items-center gap-1.5"><Icon path="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" className="w-4 h-4"/>Personal Website / Portfolio</span>}>
            <input id="portfolio-gen" type="url" value={portfolio} onChange={e=>setPortfolio(e.target.value)} className={INP} placeholder="https://yourwebsite.com"/>
          </Field>
        )}
        <p className="text-xs text-[var(--text-muted)]">
          {isTechRole ? "🖥 Tech role detected — GitHub and Portfolio fields are shown." : "Add skills like React, Python, etc. to see GitHub/Portfolio fields."}
        </p>
        <SaveBtn section="links" body={{ linkedin, github, portfolio }}/>
      </SectionCard>

      {/* ── 7. Job Preferences ── */}
      <SectionCard title="Job Preferences" icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField id="pref-type" label="Preferred Job Type" value={jobType} onChange={setJobType} options={JOB_TYPES}/>
          <Field id="pref-salary" label="Expected Salary (PKR/month)">
            <input id="pref-salary" type="number" value={desiredSalary} onChange={e=>setDesiredSalary(e.target.value)} className={INP} placeholder="e.g. 80000"/>
          </Field>
          <SelectField id="pref-remote" label="Remote Preference" value={remotePref} onChange={setRemotePref} options={REMOTE_PREFS}/>
        </div>
        <SaveBtn section="preferences" body={{ jobType, desiredSalary, remotePref }}/>
      </SectionCard>

      {/* ── 8. Live CV Preview ── */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-elevated)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] flex items-center justify-center">
              <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-4 h-4 text-[var(--brand-500)]"/>
            </div>
            <p className="font-bold text-[var(--text-primary)] text-base">Live CV Preview</p>
          </div>
        </div>
        <div className="px-6 py-5 bg-white dark:bg-[var(--bg-base)] text-[var(--text-primary)] font-sans text-sm leading-relaxed">
          {/* Name + Contact */}
          <h1 className="text-xl font-black text-[var(--text-primary)] mb-0.5">{name || "Your Name"}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)] mb-4">
            {email    && <span>✉ {email}</span>}
            {phone    && <span>📞 {phone}</span>}
            {location && <span>📍 {location}</span>}
            {linkedin && <span>🔗 LinkedIn</span>}
            {github   && <span>🐙 GitHub</span>}
            {portfolio&& <span>🌐 Portfolio</span>}
          </div>
          {summary && <><p className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Summary</p><p className="mb-4 text-xs">{summary}</p></>}
          {skills.length > 0 && (<><p className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Skills</p><p className="mb-4 text-xs">{skills.join(" · ")}</p></>)}
          {education.length > 0 && (
            <><p className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Education</p>
            {education.map((e,i)=><div key={i} className="mb-2"><p className="font-semibold text-xs">{e.institution} — {e.level}</p><p className="text-xs text-[var(--text-muted)]">{[e.board, e.year, e.obtainedMarks && e.totalMarks ? `${e.obtainedMarks}/${e.totalMarks}` : "", e.grade].filter(Boolean).join(" | ")}</p></div>)}</>
          )}
          {experience.length > 0 && (
            <><p className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 mt-2">Experience</p>
            {experience.map((e,i)=><div key={i} className="mb-2"><p className="font-semibold text-xs">{e.title} — {e.company}</p><p className="text-xs text-[var(--text-muted)]">{e.startDate}{e.current?" – Present":e.endDate?` – ${e.endDate}`:""}</p>{e.description&&<p className="text-xs mt-0.5">{e.description}</p>}</div>)}</>
          )}
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-error)_4%,transparent)] overflow-hidden">
        <div className="flex items-start gap-3 px-6 py-5 border-b border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center flex-shrink-0">
            <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-4 h-4 text-[var(--color-error)]"/>
          </div>
          <div><p className="font-bold text-[var(--color-error)] text-base">Danger Zone</p><p className="text-[var(--text-muted)] text-sm mt-0.5">These actions are permanent and cannot be undone.</p></div>
        </div>
        <div className="px-6 py-5 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] text-sm">Delete my account</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5 leading-relaxed">Permanently removes your account, profile, all applications, saved jobs, and alerts.</p>
          </div>
          <button type="button" onClick={() => setDeleteStep(1)}
            className="flex-shrink-0 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-colors">
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteStep > 0 && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={() => { if (deleteStep !== 2) setDeleteStep(0); }}/>
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-md" role="dialog" aria-modal="true">
            <div className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-2xl)] p-6 shadow-[var(--shadow-3)] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center mx-auto">
                <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-[var(--color-error)]"/>
              </div>
              <div className="text-center">
                <h3 className="font-black text-[var(--text-primary)] text-lg">Delete your account?</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2">This will permanently delete everything. <strong className="text-[var(--text-primary)]">Cannot be undone.</strong></p>
              </div>
              {deleteError && <p className="text-xs font-medium text-[var(--color-error)] text-center">{deleteError}</p>}
              <div className="flex gap-3">
                <Button variant="ghost" size="md" fullWidth disabled={deleteStep===2} onClick={() => { setDeleteStep(0); setDeleteError(""); }}>Cancel</Button>
                <Button variant="danger" size="md" fullWidth pill loading={deleteStep===2} onClick={deleteAccount}>Yes, Delete Everything</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
