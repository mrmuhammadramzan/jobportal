/**
 * usePlatformCut — fetches the platform cut percentage from DB.
 * Returns { cutPct, cut, processingFee } — all derived from the single DB value.
 * Falls back to PLATFORM_CUT_PCT env var if unavailable.
 * DRY: any component needing the cut uses this hook — never hardcode 0.85.
 */
import { useState, useEffect } from "react";
import { PLATFORM_CUT_PCT, PLATFORM_CUT, PROCESSING_FEE } from "@/lib/constants";

interface PlatformCutData {
  cutPct:        number; // e.g. 15
  cut:           number; // e.g. 0.85
  processingFee: number; // e.g. 0.15
}

export function usePlatformCut(): PlatformCutData {
  const [data, setData] = useState<PlatformCutData>({
    cutPct:        PLATFORM_CUT_PCT,
    cut:           PLATFORM_CUT,
    processingFee: PROCESSING_FEE,
  });

  useEffect(() => {
    const tok = typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
    if (!tok) return;
    fetch("/api/admin/settings", {
      credentials: "include",
      headers: { Authorization: `Bearer ${tok}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const pct = d?.platform?.platformCut;
        if (typeof pct === "number" && pct >= 0 && pct <= 99) {
          setData({ cutPct: pct, cut: (100 - pct) / 100, processingFee: pct / 100 });
        }
      })
      .catch(() => {});
  }, []);

  return data;
}
