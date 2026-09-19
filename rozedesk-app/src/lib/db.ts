/**
 * db.ts — Prisma Client singleton for Next.js + Prisma 7 + MySQL.
 *
 * Connection is handled via @prisma/adapter-mariadb (works for both MySQL and MariaDB).
 * All connection parameters come from env vars — nothing hardcoded.
 *
 * Env vars (set in .env.local / hosting platform secrets):
 *   DATABASE_URL    = mysql://user:pass@host:port/database  (preferred)
 *   -- OR individual vars --
 *   DB_HOST         = 127.0.0.1
 *   DB_PORT         = 3306         (default)
 *   DB_USER         = root         (default)
 *   DB_PASSWORD     = ""           (default)
 *   DB_NAME         = rozedesk
 *
 * Tuning (optional):
 *   DB_POOL_SIZE    = 5            (default; use 1-2 for serverless)
 *   DB_CONNECT_TIMEOUT = 10        (seconds, default 10)
 *
 * Singleton strategy:
 *   globalThis cache in ALL envs to prevent connection pool exhaustion
 *   under Next.js hot reload (dev) and module re-evaluation (prod serverless).
 *
 * DevOps SOP Hard Rule 1: no secrets in code — all from env.
 */
import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function parseDbUrl(url: string): {
  user: string; password: string; host: string; port: number; database: string;
} {
  /* mysql://user:pass@host:port/database */
  const m = url.match(/^mysql:\/\/([^:@]*)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/(.+)$/);
  if (!m) throw new Error(`Invalid DATABASE_URL format. Expected: mysql://user:pass@host:port/db`);
  return {
    user:     decodeURIComponent(m[1] || "root"),
    password: decodeURIComponent(m[2] || ""),
    host:     m[3] || "127.0.0.1",
    port:     parseInt(m[4] ?? "3306", 10),
    database: m[5] || "rozedesk",
  };
}

function createPrismaClient(): PrismaClient {
  /* ── Resolve connection config from env ── */
  let config: { host: string; port: number; user: string; password: string; database: string };

  const host = process.env.DB_HOST;
  const db   = process.env.DB_NAME;

  if (host && db) {
    /* Individual vars take priority — useful for PaaS secret injection */
    config = {
      host,
      port:     parseInt(process.env.DB_PORT ?? "3306", 10),
      user:     process.env.DB_USER     ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: db,
    };
  } else {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error(
      "DB connection not configured. Set DATABASE_URL or DB_HOST + DB_NAME in env."
    );
    config = parseDbUrl(url);
  }

  /* ── Pool tuning from env — no hardcoded defaults that hurt serverless ── */
  const connectionLimit  = parseInt(process.env.DB_POOL_SIZE       ?? "5",  10);
  const connectTimeout   = parseInt(process.env.DB_CONNECT_TIMEOUT ?? "10", 10);

  const adapter = new PrismaMariaDb({
    host:            config.host,
    port:            config.port,
    user:            config.user,
    password:        config.password,
    database:        config.database,
    connectionLimit,
    connectTimeout,
  });

  return new PrismaClient({ adapter });
}

/* ── Singleton — cached on globalThis in ALL environments ──
   Prevents connection pool exhaustion from:
   - Next.js hot reload creating multiple clients in dev
   - Module re-evaluation in serverless cold starts
   DevOps SOP: a leaked pool is an unmonitored resource; always cap and reuse. */
const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };

export const db: PrismaClient = globalForPrisma._prisma ?? createPrismaClient();

/* Cache unconditionally — not just in dev */
globalForPrisma._prisma = db;
