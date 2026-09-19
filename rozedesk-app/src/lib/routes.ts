/**
 * routes.ts — Single source of truth for all application routes.
 * DRY Hard Rule 2: one definition, referenced everywhere.
 * Never hardcode a path string in a component.
 */
export const ROUTES = {
  /* ── Public ── */
  home:    "/",
  jobs:    "/jobs",
  about:   "/about",
  contact: "/contact",

  /* ── Public auth (job seekers) ── */
  signIn:         "/signin",
  signUp:         "/signup",
  forgotPassword: "/forgot-password",
  resetPassword:  "/reset-password",

  /* ── Job Seeker Dashboard ── */
  dashboard:        "/dashboard",
  dashboardJobs:    "/dashboard/jobs",           /* browse jobs within dashboard layout */
  applications:     "/dashboard/applications",
  savedJobs:        "/dashboard/saved-jobs",
  seekerProfile:    "/dashboard/profile",
  seekerAlerts:     "/dashboard/alerts",
  /* Apply flow: /dashboard/apply/[jobId] — CV upload → payment → receipt */
  applyJob:         "/dashboard/apply",          /* prefix; append /[jobId] via applyJobUrl() */

  /* ── Super Admin (never linked publicly) ── */
  adminLogin:           "/admin/login",
  admin:                "/admin",
  adminJobs:            "/admin/jobs",
  adminPostJob:         "/admin/jobs/new",
  adminEditJob:         "/admin/jobs/[id]/edit",
  adminApplicants:      "/admin/applicants",
  adminAnalytics:       "/admin/analytics",
  adminLedger:          "/admin/ledger",
  adminPayments:        "/admin/payments",         /* review receipt uploads, approve/reject */
  adminPaymentSettings: "/admin/payment-settings", /* configure JazzCash/Easypaisa details */
  adminSettings:        "/admin/settings",

  /* ── Legal ── */
  terms:   "/terms",
  privacy: "/privacy",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/* ── URL builder helpers ── */
export function jobUrl(id: string):                string { return `${ROUTES.jobs}/${id}`; }
/** Job detail viewed inside the dashboard layout (stays within /dashboard) */
export function dashboardJobUrl(id: string):       string { return `${ROUTES.dashboardJobs}/${id}`; }
export function adminEditJobUrl(id: string):        string { return `/admin/jobs/${id}/edit`; }
export function adminJobApplicantsUrl(id: string):  string { return `${ROUTES.adminApplicants}?job=${id}`; }
/** Apply-flow URL for a specific job. /dashboard/apply/react-developer-j1 */
export function applyJobUrl(jobId: string):         string { return `${ROUTES.applyJob}/${jobId}`; }
