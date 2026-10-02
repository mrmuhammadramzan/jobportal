# Lessons Learned

> Log of mistakes, root causes, and the correct patterns to follow.
> Each entry: what went wrong → why → the correct fix → rule going forward.

---

## #001 — Next.js Build Fails: Env-Var Check at Module-Eval Time

**Date:** 2026-10-01
**Affected file:** `src/lib/apiAuth.ts`
**Build error:**
```
Error: FATAL: JWT_SECRET env var is not set. Set it before deploying.
  at module evaluation (src/lib/apiAuth.ts:17:2)
  at module evaluation (src/app/api/admin/file/route.ts:10:1)
```

### What went wrong
`JWT_SECRET` was resolved via a module-level IIFE that **threw immediately if the
env var was missing in production**. During `next build`, Next.js imports every
API route module to collect page metadata — at that point `NODE_ENV=production`
but env vars are NOT yet injected by Railway, so every imported route that
transitively imported `apiAuth.ts` crashed the build.

```ts
// ❌ WRONG — throws at import time, breaks next build
const JWT_SECRET = (() => {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET env var is not set.");
  }
  return s ?? "dev_secret_local_only";
})();
```

### Why it failed
Railway injects env vars at **container start time (runtime)**, not at
**build time**. `next build` runs at build time. So any module-level code that
reads env vars and throws will always fail in a Railway/Vercel build pipeline
even when the variable *is* set in the dashboard.

### The correct fix
Move the validation into a **lazy getter function** that is called inside the
request handler, not at module load time:

```ts
// ✅ CORRECT — called at request time, never at module eval
export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET env var is not set.");
    }
    return "dev_secret_local_only";
  }
  return s;
}
```

### Additional issue found during audit
5 auth route files (`signin`, `signup`, `me`, `callback`, `admin/signin`) each
had their own `const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret"` at
module level. While these did NOT throw, they silently used the weak fallback
`"dev_secret"` in production if the env var was missing — a critical security
hole. All were refactored to call `getJwtSecret()` from `apiAuth.ts`.

### Rule going forward
1. **Never throw at module-eval time** based on `process.env` checks. Always
   defer env validation to a lazy getter called inside the route handler.
2. **Never use `?? "fallback"` for security-critical secrets** at module level.
   A missing secret in prod must 500, not silently downgrade to a weak key.
3. **One source of truth for JWT_SECRET** — `getJwtSecret()` in `apiAuth.ts`.
   No other file should read `process.env.JWT_SECRET` directly.
4. **DRY rule for secrets:** if you find yourself writing `process.env.JWT_SECRET`
   in more than one file, that is a signal to centralise it.

### Files changed
- `src/lib/apiAuth.ts` — IIFE removed, `getJwtSecret()` exported as lazy getter
- `src/app/api/auth/signin/route.ts` — uses `getJwtSecret()`
- `src/app/api/auth/signup/route.ts` — uses `getJwtSecret()`
- `src/app/api/auth/me/route.ts` — refactored to use `getAuthUser()` (DRY)
- `src/app/api/auth/callback/route.ts` — uses `getJwtSecret()`
- `src/app/api/admin/signin/route.ts` — uses `getJwtSecret()`

---
