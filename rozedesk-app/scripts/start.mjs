/**
 * start.mjs — Production start script for Railway.
 *
 * Why this exists instead of a shell one-liner in railway.toml:
 *   - Shell ${VAR} expansion fails when Railway env vars contain special chars
 *     or when the private domain reference hasn't resolved in the shell context.
 *   - Node.js reads process.env reliably regardless of shell quoting.
 *   - URL-encodes credentials before building the connection string.
 *   - Fails fast with a clear message if required vars are missing.
 *
 * Execution order:
 *   1. Build the MySQL URL from env vars (Tier 1: individual vars, Tier 2: MYSQL_URL)
 *   2. Run `prisma db push` synchronously — syncs schema to Railway DB
 *   3. Exec `next start` — replaces this process (clean PID 1 handoff)
 */
import { execSync, execFileSync } from "node:child_process";
import { existsSync }             from "node:fs";
import { fileURLToPath }          from "node:url";
import path                       from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const APP   = path.resolve(__dir, "..");          // rozedesk-app/
const BIN   = path.join(APP, "node_modules/.bin");

/* ── 1. Resolve MySQL URL ───────────────────────────────────────────────── */
function buildMysqlUrl() {
  const e = process.env;

  // Debug: log which vars are present (values masked for security)
  const present = ["MYSQLHOST","MYSQLDATABASE","MYSQLPASSWORD","MYSQLUSER","MYSQLPORT","MYSQL_URL","DATABASE_URL"]
    .map(k => `${k}=${e[k] ? "SET" : "MISSING"}`)
    .join(", ");
  console.log(`[start.mjs] DB env check: ${present}`);

  /* Tier 1 — Railway individual vars (most specific) */
  if (e.MYSQLHOST && e.MYSQLDATABASE) {
    const user = encodeURIComponent(e.MYSQLUSER     ?? "root");
    const pass = encodeURIComponent(e.MYSQLPASSWORD ?? "");
    const host = e.MYSQLHOST;
    const port = e.MYSQLPORT ?? "3306";
    const db   = e.MYSQLDATABASE;
    return `mysql://${user}:${pass}@${host}:${port}/${db}`;
  }

  /* Tier 2 — Pre-composed MYSQL_URL from Railway plugin */
  if (e.MYSQL_URL) return e.MYSQL_URL;

  /* Tier 3 — Generic DATABASE_URL */
  if (e.DATABASE_URL) return e.DATABASE_URL;

  throw new Error(
    "[start.mjs] No database URL found. " +
    "Set MYSQLHOST+MYSQLDATABASE, MYSQL_URL, or DATABASE_URL in Railway variables."
  );
}

const MYSQL_URL = buildMysqlUrl();
console.log(`[start.mjs] DB host resolved: ${MYSQL_URL.replace(/:([^@]+)@/, ":***@")}`);

/* ── 2. prisma db push ──────────────────────────────────────────────────── */
const schema = path.join(APP, "prisma/schema.prisma");
const config = path.join(APP, "prisma7.config.ts");
const prisma = path.join(BIN, "prisma");

if (!existsSync(prisma)) throw new Error(`[start.mjs] prisma binary not found at ${prisma}`);

console.log("[start.mjs] Running prisma db push...");
execFileSync(prisma, [
  "db", "push",
  `--schema=${schema}`,
  `--config=${config}`,
  `--url=${MYSQL_URL}`,
  "--accept-data-loss",
], { stdio: "inherit", env: process.env });

console.log("[start.mjs] Schema synced. Starting Next.js...");

/* ── 3. Exec next start (replaces this process — clean PID handoff) ─────── */
const next  = path.join(BIN, "next");
const port  = process.env.PORT ?? "3000";

// execFileSync with the last arg as process replacement isn't possible in Node —
// use execSync which inherits stdio and exits this process when next exits.
process.exitCode = 0;
try {
  execFileSync(next, ["start", "-p", port], { stdio: "inherit", env: process.env });
} catch (e) {
  process.exit(e.status ?? 1);
}
