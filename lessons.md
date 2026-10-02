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

---

## #002 — Prisma Generate Fails: `--prefix` vs Real `cd` in Nixpacks Monorepo

**Date:** 2026-10-01
**Affected file:** `nixpacks.toml`
**Build error:**
```
Error: Could not resolve @prisma/client.
Please try to install it with npm i @prisma/client and rerun npx "prisma generate"
```

### What went wrong
The nixpacks install phase used `npm ci --prefix rozedesk-app`. This installs
dependencies into `rozedesk-app/node_modules/` but the **working directory
remains `/app` (the monorepo root)**. When `prisma generate` then runs as
`cd rozedesk-app && ./node_modules/.bin/prisma generate --schema=../prisma/schema.prisma`,
Prisma's generator resolves `@prisma/client` using Node's module resolution
starting from the schema file's location (`/app/prisma/`), not from
`rozedesk-app/`. Since `@prisma/client` is only in `rozedesk-app/node_modules/`,
resolution fails.

```toml
# ❌ WRONG — --prefix installs deps but leaves CWD at /app
[phases.install]
cmds = ["npm ci --prefix rozedesk-app --ignore-engines"]
```

### Why it failed
`npm ci --prefix <dir>` is equivalent to `cd <dir> && npm ci` for the install
itself, but it does **not** persist the working directory for subsequent commands.
Each nixpacks phase command starts fresh from the WORKDIR (`/app`). So the
install succeeded, but `prisma generate` ran with a stale CWD context where
`@prisma/client` wasn't on the Node resolution path.

### The correct fix
Use a real `cd` inside the install command so the working directory is explicit
and consistent with the build phase commands:

```toml
# ✅ CORRECT — cd makes CWD explicit, consistent across all phases
[phases.install]
cmds = ["cd rozedesk-app && npm ci --ignore-engines"]
```

### Second issue: missing `openssl` in nixPkgs
Prisma's query-engine binary requires OpenSSL at both build and runtime.
Removing it from `nixPkgs` causes silent failures or binary-not-found errors
on some Prisma operations. Always include it:

```toml
# ✅ Always include openssl for Prisma
[phases.setup]
nixPkgs = ["nodejs_22", "openssl"]
```

### Rules going forward
1. **Never use `npm ci --prefix` in nixpacks** for a monorepo where subsequent
   commands depend on a consistent CWD. Always use `cd <dir> && npm ci`.
2. **All nixpacks phases must share the same CWD convention.** If install does
   `cd rozedesk-app`, then build and start must also `cd rozedesk-app`.
3. **Always include `openssl` in nixPkgs** for any project using Prisma.
4. **When a build breaks after a nixpacks.toml change**, compare the working
   build's Nixpacks plan output vs the failing one — the phase commands shown
   in the Railway log reveal exactly what changed.

### Files changed
- `nixpacks.toml` — install changed from `--prefix` to `cd rozedesk-app && npm ci --ignore-engines`; `openssl` restored to nixPkgs

---

---

## #003 — Prisma 7 Resolves @prisma/client from SCHEMA Location, Not Output Location

**Date:** 2026-10-02
**Affected files:** `prisma/schema.prisma`, `nixpacks.toml`, `railway.toml`, `rozedesk-app/package.json`, `prisma7.config.ts`
**Build error:**
```
Error: Could not resolve @prisma/client.
Please try to install it with npm i @prisma/client and rerun npx "prisma generate"
```

### What went wrong
`schema.prisma` lived at `/app/prisma/schema.prisma` (monorepo root). All
dependencies (`@prisma/client`, `prisma` CLI) were installed into
`rozedesk-app/node_modules/`. Prisma 7's `generate` command resolves
`@prisma/client` by walking up the directory tree **from the schema file's
location**, not from the output directory or the CWD where the CLI runs.

```
Schema at:   /app/prisma/schema.prisma
Resolution:  /app/prisma/node_modules/ → not found
             /app/node_modules/         → not found (never installed here)
             STOPS — @prisma/client never found
```

`rozedesk-app/node_modules/@prisma/client` is never checked because it is not
in the parent chain of `/app/prisma/`.

### Why previous cd-fix didn't help
Changing `npm ci --prefix rozedesk-app` to `cd rozedesk-app && npm ci` fixed
the install CWD, but Prisma's resolver ignores the process CWD — it uses the
**schema file's filesystem location** to walk the module tree.

### The correct fix
Move `schema.prisma` **inside** `rozedesk-app/prisma/schema.prisma` so it is
co-located with its dependencies. Now Node resolution from the schema walks:

```
Schema at:   /app/rozedesk-app/prisma/schema.prisma
Resolution:  /app/rozedesk-app/prisma/node_modules/ → not found
             /app/rozedesk-app/node_modules/         → FOUND ✓
```

Update the `output` path in schema from `"../rozedesk-app/src/generated/prisma"`
to `"../src/generated/prisma"` (same final absolute path, shorter relative hop).

### All config files to update when moving schema
| File | Old path | New path |
|---|---|---|
| `schema.prisma` generator output | `../rozedesk-app/src/generated/prisma` | `../src/generated/prisma` |
| `nixpacks.toml` build + start | `--schema=../prisma/schema.prisma` | `--schema=./prisma/schema.prisma` |
| `railway.toml` startCommand | `--schema=../prisma/schema.prisma` | `--schema=./prisma/schema.prisma` |
| `rozedesk-app/package.json` scripts | `--schema=../prisma/schema.prisma` | `--schema=./prisma/schema.prisma` |
| `prisma7.config.ts` | `"prisma/schema.prisma"` | `"rozedesk-app/prisma/schema.prisma"` |

### Rules going forward
1. **In a monorepo, always co-locate `schema.prisma` with the app that owns it.**
   Prisma resolves `@prisma/client` from the schema file's directory — not from
   the CWD and not from the output directory.
2. **Never split the schema from its `node_modules`.** If the schema is outside
   the app directory, Prisma's module resolution will fail unless you also install
   deps at the schema's ancestor level.
3. **When prisma generate fails with "Could not resolve @prisma/client"**, the
   first thing to check is: where is `schema.prisma`? Where is `node_modules/@prisma/client`?
   Is the schema's directory in the parent chain of the node_modules directory?

### Files changed
- `rozedesk-app/prisma/schema.prisma` — created (moved from root `prisma/`)
- `prisma/schema.prisma` — left in place with redirect comment (ref only)
- `nixpacks.toml` — schema path updated
- `railway.toml` — schema path updated
- `rozedesk-app/package.json` — schema paths updated, db scripts simplified
- `prisma7.config.ts` — schema path updated

---
