"use client";
/**
 * useApplicationStatus — checks if the logged-in user has already applied
 * to a specific job and returns the application status.
 *
 * Returns:
 *   { applied: true,  status: "CV_UNDER_REVIEW" }  — already applied
 *   { applied: false, status: null }                — not yet applied
 *   { applied: false, status: null }                — not logged in / loading
 *
 * DRY: single hook used by /jobs/[id] and /dashboard/jobs/[id].
 * Frontend SOP §6.1: loading state handled by caller.
 */

import { useState, useEffect } from "react";

interface Result {
  applied:  boolean;
  status:   string | null;
  loading:  boolean;
}

function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

export function useApplicationStatus(jobId: string | undefined): Result {
  const [state, setState] = useState<Result>({ applied: false, status: null, loading: true });

  useEffect(() => {
    if (!jobId || !token()) { setState({ applied: false, status: null, loading: false }); return; }

    fetch("/api/seeker/applications", {
      credentials: "include",
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((apps: { jobId: string; status: string }[]) => {
        const match = Array.isArray(apps) ? apps.find(a => a.jobId === jobId) : null;
        setState({
          applied: Boolean(match),
          status:  match?.status ?? null,
          loading: false,
        });
      })
      .catch(() => setState({ applied: false, status: null, loading: false }));
  }, [jobId]);

  return state;
}
