/**
 * db.ts — Prisma Client singleton for Next.js + Prisma 7 + MySQL.
 *
 * LAZY INITIALISATION: The client is created on first access, not at module
 * load time. This prevents Next.js build-time failures when DATABASE_URL is
 * not present in the build environment (env vars are runtime-only on Railway).
 *
 * All connection parameters come from env vars — nothing hardcoded.
 *
 * Env vars (set in hosting platform secrets):
 *   DATABASE_URL       = mysql://user:pass@host:port/database  (preferred)
 *   DB_HOST            = hostname
 *   DB_PORT            = 3306  (default)
 *   DB_USER            = root  (default)
 *   DB_PASSWORD        = ""    (default)
 *   DB_NAME            = rozedesk
 *   DB_POOL_SIZE       = 5     (default; use 1–2 for serverless)
 *   DB_CONNECT_TIMEOUT = 10    (seconds)
 *
 * DevOps SOP Hard Rule 1: no secrets in code — all from env.
 */
import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function parseDbUrl(url: string) {
  const m = url.match(/^mysql:\/\/([^:@]*)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/(.+)$/);
  if (!m) throw new Error("Invalid DATABASE_URL. Expected: mysql://user:pass@host:port/db");
  return {
    user:     decodeURIComponent(m[1] || "root"),
    password: decodeURIComponent(m[2] || ""),
    host:     m[3] || "127.0.0.1",
    port:     parseInt(m[4] ?? "3306", 10),
    database: m[5] || "rozedesk",
  };
}

function createPrismaClient(): PrismaClient {
  const host = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  const config = (host && dbName)
    ? {
        host,
        port:     parseInt(process.env.DB_PORT     ?? "3306", 10),
        user:     process.env.DB_USER               ?? "root",
        password: process.env.DB_PASSWORD           ?? "",
        database: dbName,
      }
    : parseDbUrl(
        process.env.DATABASE_URL ??
        (() => { throw new Error("Set DATABASE_URL or DB_HOST+DB_NAME in env."); })()
      );

  const adapter = new PrismaMariaDb({
    ...config,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE       ?? "5",  10),
    connectTimeout:  parseInt(process.env.DB_CONNECT_TIMEOUT ?? "10", 10),
  });

  return new PrismaClient({ adapter });
}

/* ── Lazy singleton ──────────────────────────────────────────────────────────
   _prisma is undefined until the first actual DB call at RUNTIME.
   This means Next.js build-time static analysis never triggers createPrismaClient(),
   so missing DATABASE_URL during build does NOT fail the build.
   DevOps SOP: runtime env vars must not be required at build time.          */
const g = globalThis as unknown as { _prisma?: PrismaClient };

function getDb(): PrismaClient {
  if (!g._prisma) g._prisma = createPrismaClient();
  return g._prisma;
}

/* Export as a Proxy so `db.user.findMany(...)` syntax still works,
   but the underlying client is only created when a property is first accessed. */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
