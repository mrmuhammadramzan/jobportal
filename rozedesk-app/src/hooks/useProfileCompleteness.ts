/**
 * useProfileCompleteness — fetches completeness on mount.
 * DRY: any component that needs to gate behind profile uses this hook.
 * Returns { pct, canApply, missing, loading }.
 */
import { useState, useEffect } from "react";

interface Completeness {
  pct:      number;
  canApply: boolean;
  missing:  string[];
}

export function useProfileCompleteness() {
  const [data,    setData]    = useState<Completeness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
    if (!tok) { setLoading(false); return; }

    fetch("/api/seeker/profile/completeness", {
      credentials: "include",
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}
