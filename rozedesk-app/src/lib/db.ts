/**
 * db.ts — Prisma Client singleton for Next.js + Prisma 7 + MySQL.
 *
 * Build-time safety: DATABASE_URL falls back to a dummy value during
 * `next build` so static analysis never throws. The real connection is
 * only established at runtime when an actual DB query is made.
 *
 * Env vars (set in hosting platform secrets):
 *   DATABASE_URL       = mysql://user:pass@host:port/database  (preferred)
 *   DB_HOST / DB_NAME  = alternative individual vars
 *   DB_POOL_SIZE       = 5  (default; 1–2 for serverless)
 *   DB_CONNECT_TIMEOUT = 10 (seconds)
 *
 * DevOps SOP Hard Rule 1: no secrets in code — all from env.
 */
import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/* Dummy URL used only at build time so Next.js static analysis doesn't throw.
   The adapter never actually connects during build — no query is executed.
   Accepts any string — even unresolved Railway templates like ${{MYSQLHOST}}.   */
const BUILD_TIME_DUMMY = {
  user: "build", password: "dummy", host: "localhost", port: 3306, database: "build",
};

function parseDbUrl(url: string) {
  const m = url.match(/^mysql:\/\/([^:@]*)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/(.+)$/);
  if (!m) return null;  // return null instead of throwing — caller decides fallback
  return {
    user:     decodeURIComponent(m[1] || "root"),
    password: decodeURIComponent(m[2] || ""),
    host:     m[3] || "127.0.0.1",
    port:     parseInt(m[4] ?? "3306", 10),
    database: m[5] || "rozedesk",
  };
}

function createPrismaClient(): PrismaClient {
  const host   = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  const config = (host && dbName)
    ? {
        host,
        port:     parseInt(process.env.DB_PORT     ?? "3306", 10),
        user:     process.env.DB_USER               ?? "root",
        password: process.env.DB_PASSWORD           ?? "",
        database: dbName,
      }
    /* Parse DATABASE_URL — fall back to dummy config if URL is invalid/unresolved */
    : parseDbUrl(process.env.DATABASE_URL ?? "") ?? BUILD_TIME_DUMMY;

  const adapter = new PrismaMariaDb({
    ...config,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE       ?? "5",  10),
    connectTimeout:  parseInt(process.env.DB_CONNECT_TIMEOUT ?? "10", 10),
  });

  return new PrismaClient({ adapter });
}

/* ── Singleton — cached on globalThis in ALL environments ── */
const g = globalThis as unknown as { _prisma?: PrismaClient };
export const db: PrismaClient = g._prisma ?? (g._prisma = createPrismaClient());
