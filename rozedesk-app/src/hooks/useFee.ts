/**
 * useFee — fetches the current application fee from /api/fee.
 * Falls back to APP_FEE_PKR env var if request fails.
 * DRY: any component needing the fee uses this hook — never fetch inline.
 */
import { useState, useEffect } from "react";
import { APP_FEE_PKR } from "@/lib/constants";

export function useFee(): number {
  const [fee, setFee] = useState<number>(APP_FEE_PKR);

  useEffect(() => {
    fetch("/api/fee")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.fee) setFee(data.fee); })
      .catch(() => {}); // silent — fallback to env default
  }, []);

  return fee;
}
