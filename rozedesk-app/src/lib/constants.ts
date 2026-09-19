/**
 * constants.ts — Shared business constants for RozeDesk.
 * DRY Hard Rule 2: each value defined ONCE — all controlled by env or DB.
 * NEVER hardcode fee amounts or percentages here.
 */

/**
 * APP_FEE_PKR — env fallback. Live value comes from DB via /api/fee or useFee().
 * Set NEXT_PUBLIC_APP_FEE in .env.local to change default.
 */
export const APP_FEE_PKR: number =
  typeof process !== "undefined"
    ? parseInt(process.env.NEXT_PUBLIC_APP_FEE ?? process.env.APP_FEE_PKR ?? "150", 10)
    : 150;

/**
 * PLATFORM_CUT_PCT — percentage admin keeps e.g. 15 = 15% cut.
 * Live value comes from DB (platformCut key in platform_settings).
 * Set PLATFORM_CUT_PCT in .env.local to change default.
 */
export const PLATFORM_CUT_PCT: number =
  typeof process !== "undefined"
    ? parseInt(process.env.PLATFORM_CUT_PCT ?? "15", 10)
    : 15;

export const PLATFORM_CUT:   number = (100 - PLATFORM_CUT_PCT) / 100;  // e.g. 0.85
export const PROCESSING_FEE: number = PLATFORM_CUT_PCT / 100;           // e.g. 0.15

/** Net amount received per application */
export const APP_FEE_NET: number = Math.round(APP_FEE_PKR * PLATFORM_CUT);

/** Supported payment methods — drives UI in payment settings + apply flow */
export const PAYMENT_METHODS = [
  { key: "jazzcash",  label: "JazzCash",  logo: "JC" },
  { key: "easypaisa", label: "Easypaisa", logo: "EP" },
] as const;

export type PaymentMethodKey = typeof PAYMENT_METHODS[number]["key"];
