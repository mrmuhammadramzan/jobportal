/**
 * api.ts — Shared HTTP client for RozeDesk.
 *
 * DRY Hard Rule 2: one fetch wrapper used everywhere.
 * Never call fetch() directly in a page or component.
 * Always import { api } from "@/lib/api" and use api.get/post/etc.
 *
 * Backend readiness:
 *   1. Set NEXT_PUBLIC_API_URL in .env.local to point at your backend.
 *   2. Auth token is read from localStorage['rozedesk-token'] and attached
 *      as a Bearer header on every request. When auth is implemented,
 *      the token is written here after login and read on every request.
 *   3. All errors are normalised into ApiError so callers don't need
 *      to parse Response objects.
 *
 * Frontend SOP §Hard Rule 1: client validation is UX only — server re-validates.
 * Frontend SOP §6.1: all 3 states (loading / error / success) handled by callers.
 */

/* ── Base URL — override via NEXT_PUBLIC_API_URL in .env.local ── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/* ── Standardised error type ── */
export class ApiError extends Error {
  constructor(
    public status:  number,
    public message: string,
    public data?:   unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ── Token helpers — swap for cookie/session when ready ── */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rozedesk-token");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("rozedesk-token", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("rozedesk-token");
    localStorage.removeItem("rozedesk-user");
  }
}

/* ── Core fetch wrapper ── */
async function request<T>(
  method:  "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path:    string,
  body?:   unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include", /* send cookies if using HttpOnly cookie auth */
  });

  /* Parse response — handle both JSON and empty bodies */
  let data: unknown;
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : res.statusText;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

/* ── File upload helper ── */
export async function uploadFile(
  path:  string,
  file:  File,
  field: string = "file",
  extra?: Record<string, string>,
): Promise<unknown> {
  const token = getToken();
  const form  = new FormData();
  form.append(field, file);
  if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, v));

  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body:    form,
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? res.statusText;
    throw new ApiError(res.status, message, data);
  }

  return data;
}

/* ── Public API surface ── */
export const api = {
  get:    <T>(path: string)                    => request<T>("GET",    path),
  post:   <T>(path: string, body: unknown)     => request<T>("POST",   path, body),
  put:    <T>(path: string, body: unknown)     => request<T>("PUT",    path, body),
  patch:  <T>(path: string, body: unknown)     => request<T>("PATCH",  path, body),
  delete: <T>(path: string)                    => request<T>("DELETE", path),
};

/* ══════════════════════════════════════════════════════════════
   TYPED API ENDPOINTS
   All backend endpoints documented here — one source of truth.
   Wire up real calls by replacing the setTimeout in each page.
   ══════════════════════════════════════════════════════════════ */

/* ── Auth ── */
export const authApi = {
  /** POST /auth/signin  → { token, user } */
  signIn:  (phone: string, password: string) =>
    api.post<{ token: string; user: AuthUser }>("/auth/signin", { phone, password }),

  /** POST /auth/signup  → { token, user } */
  signUp:  (data: SignUpPayload) =>
    api.post<{ token: string; user: AuthUser }>("/auth/signup", data),

  /** POST /auth/admin/signin → { token, user } */
  adminSignIn: (email: string, password: string) =>
    api.post<{ token: string; user: AuthUser }>("/auth/admin/signin", { email, password }),

  /** POST /auth/signout → { message } */
  signOut: () => api.post<{ message: string }>("/auth/signout", {}),

  /** GET /auth/me → AuthUser */
  me: () => api.get<AuthUser>("/auth/me"),
};

/* ── Jobs (public) ── */
export const jobsApi = {
  /** GET /jobs?q=&category=&location=&type=&sort= → Job[] */
  list:   (params?: Record<string, string>) =>
    api.get<Job[]>(`/jobs?${new URLSearchParams(params).toString()}`),

  /** GET /jobs/:id → Job */
  get:    (id: string) => api.get<Job>(`/jobs/${id}`),
};

/* ── Seeker ── */
export const seekerApi = {
  /** GET /seeker/profile → SeekerProfile */
  getProfile:   ()            => api.get<SeekerProfile>("/seeker/profile"),

  /** PUT /seeker/profile → SeekerProfile */
  updateProfile:(data: Partial<SeekerProfile>) =>
    api.put<SeekerProfile>("/seeker/profile", data),

  /** POST /seeker/profile/cv (file upload) */
  uploadCV:     (file: File)  => uploadFile("/seeker/profile/cv", file, "cv"),

  /** GET /seeker/applications → Application[] */
  getApplications: ()         => api.get<Application[]>("/seeker/applications"),

  /** GET /seeker/saved-jobs → SavedJob[] */
  getSavedJobs: ()            => api.get<SavedJob[]>("/seeker/saved-jobs"),

  /** GET /seeker/alerts → JobAlert[] */
  getAlerts:    ()            => api.get<JobAlert[]>("/seeker/alerts"),

  /** POST /seeker/alerts → JobAlert */
  createAlert:  (data: Omit<JobAlert, "id">) =>
    api.post<JobAlert>("/seeker/alerts", data),

  /** PATCH /seeker/alerts/:id → JobAlert */
  updateAlert:  (id: string, data: Partial<JobAlert>) =>
    api.patch<JobAlert>(`/seeker/alerts/${id}`, data),

  /** DELETE /seeker/alerts/:id → void */
  deleteAlert:  (id: string) => api.delete(`/seeker/alerts/${id}`),
};

/* ── Application flow ── */
export const applicationApi = {
  /**
   * POST /applications
   * Body: FormData with cv (File) + jobId + paymentMethod
   * Returns: { applicationId, paymentDetails }
   */
  create:          (jobId: string, cvFile: File, paymentMethod: string) =>
    uploadFile("/applications", cvFile, "cv", { jobId, paymentMethod }),

  /**
   * POST /applications/:id/receipt
   * Body: FormData with receipt (File)
   * Returns: Application
   */
  uploadReceipt:   (applicationId: string, receipt: File) =>
    uploadFile(`/applications/${applicationId}/receipt`, receipt, "receipt"),

  /** GET /applications/:id → Application */
  get:             (id: string) => api.get<Application>(`/applications/${id}`),
};

/* ── Admin ── */
export const adminApi = {
  /* Jobs */
  listJobs:    ()             => api.get<AdminJob[]>("/admin/jobs"),
  createJob:   (data: unknown)=> api.post<AdminJob>("/admin/jobs", data),
  updateJob:   (id: string, data: unknown) =>
    api.put<AdminJob>(`/admin/jobs/${id}`, data),
  closeJob:    (id: string)   => api.patch(`/admin/jobs/${id}`, { status: "Closed" }),
  deleteJob:   (id: string)   => api.delete(`/admin/jobs/${id}`),

  /* Applicants */
  listApplicants: (params?: Record<string, string>) =>
    api.get<Applicant[]>(`/admin/applicants?${new URLSearchParams(params).toString()}`),
  updateApplicantStatus: (id: string, status: string, reason?: string) =>
    api.patch(`/admin/applicants/${id}/status`, { status, reason }),

  /* Payments */
  listReceipts: () => api.get<Receipt[]>("/admin/payments"),
  approveReceipt: (id: string) =>
    api.patch(`/admin/payments/${id}`, { status: "approved" }),
  rejectReceipt:  (id: string, reason: string) =>
    api.patch(`/admin/payments/${id}`, { status: "rejected", reason }),

  /* Analytics */
  getStats:     (period: string) =>
    api.get<AdminStats>(`/admin/analytics?period=${period}`),

  /* Ledger */
  getTransactions: () => api.get<Transaction[]>("/admin/ledger"),
  exportLedgerCsv: () => fetch(`${BASE_URL}/admin/ledger/export`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(r => r.blob()),

  /* Settings */
  getSettings:    () => api.get<AdminSettings>("/admin/settings"),
  updateSettings: (data: Partial<AdminSettings>) =>
    api.patch("/admin/settings", data),

  /* Payment settings */
  getPaymentSettings:    () => api.get("/admin/payment-settings"),
  updatePaymentSettings: (method: string, data: unknown) =>
    api.put(`/admin/payment-settings/${method}`, data),
};

/* ══════════════════════════════════════════════════════════════
   SHARED TYPE DEFINITIONS
   These match what the backend will return.
   Move to src/types/ when the file grows large.
   ══════════════════════════════════════════════════════════════ */

export interface AuthUser {
  id:       string;
  name:     string;
  phone:    string;
  email?:   string;   /* kept optional — admin accounts may still have email */
  role:     "seeker" | "admin";
  initials: string;
}

export interface SignUpPayload {
  fullName: string;
  phone:    string;
  password: string;
}

export interface Job {
  id:          string;
  title:       string;
  company:     string;
  location:    string;
  type:        string;
  category:    string;
  salary?:     string;
  posted:      string;
  deadline?:   string;
  applicants:  number;
  description: string;
  requirements: string[];
  benefits:    string[];
  status:      "Active" | "Closed";
}

export interface AdminJob extends Job {
  newToday: number;
}

export interface Application {
  id:          string;
  jobId:       string;
  jobTitle:    string;
  company:     string;
  status:      string;
  appliedDate: string;
  paymentStatus: "pending" | "approved" | "rejected";
}

export interface SavedJob {
  id:      string;
  jobId:   string;
  title:   string;
  company: string;
  location:string;
  type:    string;
  savedOn: string;
}

export interface JobAlert {
  id:        string;
  keywords:  string;
  location:  string;
  type:      string;
  frequency: string;
  active:    boolean;
}

export interface SeekerProfile {
  id:          string;
  fullName:    string;
  email:       string;
  phone:       string;
  location:    string;
  summary:     string;
  skills:      string[];
  jobType:     string;
  salary:      string;
  remotePref:  string;
  cvUrl?:      string;
}

export interface Applicant {
  id:        string;
  name:      string;
  email:     string;
  phone:     string;
  jobId:     string;
  jobTitle:  string;
  status:    string;
  date:      string;
  experience:string;
  location:  string;
}

export interface Receipt {
  id:               string;
  applicantName:    string;
  applicantEmail:   string;
  jobTitle:         string;
  method:           string;
  amount:           number;
  receiptRef:       string;
  submittedAt:      string;
  status:           "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface Transaction {
  id:            string;
  applicantName: string;
  jobTitle:      string;
  amount:        number;
  net:           number;
  status:        "paid" | "pending" | "refunded";
  date:          string;
}

export interface AdminStats {
  listings:    number;
  applicants:  number;
  visitors:    number;
  revenue:     number;
}

export interface AdminSettings {
  name:         string;
  email:        string;
  siteName:     string;
  tagline:      string;
  contactEmail: string;
  notifNew:     boolean;
  notifShortlist: boolean;
  notifWeekly:  boolean;
}

/* ══════════════════════════════════════════════════════════════
   safeFetch — defensive fetch wrapper for direct fetch() calls
   ──────────────────────────────────────────────────────────────
   WHY THIS EXISTS:
   Any time a server returns HTML instead of JSON (404 page, 500
   error page, or a redirect to /signin), a raw `await res.json()`
   blows up with "Unexpected token '<', '<!DOCTYPE'...".

   RULES (Backend SOP Hard Rule 2 — never swallow silently):
     1. Check Content-Type BEFORE calling .json().
     2. Parse body exactly ONCE — no double-consume.
     3. If !res.ok, always throw ApiError with a clean message.
     4. If body is not JSON, surface the HTTP status text, not a
        raw SyntaxError.

   USAGE (replaces raw fetch in components):
     import { safeFetch } from "@/lib/api";

     const data = await safeFetch<WalletData>("/api/game/wallet", {
       credentials: "include",
       headers: authHeaders(),
     });
     // throws ApiError on !ok or non-JSON response
     // caller wraps in try/catch and shows toast on ApiError

   FORM DATA (multipart/form-data uploads):
     const data = await safeFetch<{ depositId: string }>(
       "/api/game/deposit",
       { method: "POST", credentials: "include", body: formData,
         headers: { Authorization: `Bearer ${tok}` } },
       // NOTE: omit Content-Type header for FormData — browser sets
       // the boundary automatically.
     );
   ══════════════════════════════════════════════════════════════ */
export async function safeFetch<T = unknown>(
  url:     string,
  init?:   RequestInit,
): Promise<T> {
  let res: Response;

  /* ── Network-level failure (offline, DNS, CORS) ── */
  try {
    res = await fetch(url, init);
  } catch (networkErr: unknown) {
    const msg = networkErr instanceof Error
      ? networkErr.message
      : "Network error — check your connection.";
    throw new ApiError(0, msg);
  }

  /* ── Parse body exactly once ── */
  const ct   = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");

  let body: unknown;
  if (isJson) {
    try {
      body = await res.json();
    } catch {
      /* Server said Content-Type: application/json but sent garbage */
      throw new ApiError(
        res.status,
        `Server returned malformed JSON (HTTP ${res.status}).`,
      );
    }
  } else {
    /* HTML error page, plain text, empty body — read as text */
    const text = await res.text().catch(() => "");
    body = text || res.statusText;
  }

  /* ── Error response ── */
  if (!res.ok) {
    const message =
      isJson &&
      typeof body === "object" &&
      body !== null &&
      "message" in body
        ? String((body as { message: unknown }).message)
        : isJson
          ? `Request failed (HTTP ${res.status}).`
          : `Server error (HTTP ${res.status}) — expected JSON but received ${ct || "no content-type"}.`;
    throw new ApiError(res.status, message, body);
  }

  return body as T;
}
