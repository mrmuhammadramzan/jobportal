/**
 * db.ts — Prisma Client singleton for Next.js + Prisma 7 + MySQL.
 *
 * Connection resolution — three-tier fallback (evaluated in order):
 *
 *   Tier 1 — Railway MySQL individual vars (set automatically by Railway plugin):
 *     MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
 *
 *   Tier 2 — Standard DATABASE_URL / MYSQL_URL (works on Railway + any other host):
 *     DATABASE_URL  or  MYSQL_URL
 *
 *   Tier 3 — Generic individual vars (custom hosting, CI, legacy):
 *     DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 *   Tier 4 — Build-time dummy (Next.js static analysis — never connects to DB).
 *
 * DevOps SOP Hard Rule 1: zero secrets in code — everything from env.
 * DRY: one place defines the resolution logic; nothing else touches DB config.
 */
import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/* ── Types ── */
interface DbConfig {
  host:     string;
  port:     number;
  user:     string;
  password: string;
  database: string;
}

/* Used only during `next build` when no real DB is reachable.
   The adapter never connects during static analysis — no query runs. */
const BUILD_DUMMY: DbConfig = {
  host: "localhost", port: 3306,
  user: "build", password: "dummy", database: "build",
};

/** Parse a standard MySQL URL into a DbConfig.
 *  Returns null if the URL is malformed or empty — caller decides fallback. */
function parseUrl(url: string): DbConfig | null {
  try {
    // mysql://user:pass@host:port/database
    const m = url.match(
      /^mysql:\/\/([^:@]*?)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/(.+)$/
    );
    if (!m) return null;
    return {
      user:     decodeURIComponent(m[1] || "root"),
      password: decodeURIComponent(m[2] || ""),
      host:     m[3] || "127.0.0.1",
      port:     parseInt(m[4] ?? "3306", 10),
      database: m[5] || "rozedesk",
    };
  } catch {
    return null;
  }
}

/** Resolve DB connection config from environment — never throws. */
function resolveConfig(): DbConfig {
  const e = process.env;

  /* Tier 1 — Railway MySQL plugin individual vars (most reliable on Railway) */
  if (e.MYSQLHOST && e.MYSQLDATABASE) {
    return {
      host:     e.MYSQLHOST,
      port:     parseInt(e.MYSQLPORT     ?? "3306", 10),
      user:     e.MYSQLUSER              ?? "root",
      password: e.MYSQLPASSWORD          ?? "",
      database: e.MYSQLDATABASE,
    };
  }

  /* Tier 2 — Pre-composed URL (Railway MYSQL_URL or self-hosted DATABASE_URL) */
  const url = e.DATABASE_URL || e.MYSQL_URL;
  if (url) {
    const parsed = parseUrl(url);
    if (parsed) return parsed;
  }

  /* Tier 3 — Generic individual vars (custom hosting / CI) */
  if (e.DB_HOST && e.DB_NAME) {
    return {
      host:     e.DB_HOST,
      port:     parseInt(e.DB_PORT     ?? "3306", 10),
      user:     e.DB_USER              ?? "root",
      password: e.DB_PASSWORD          ?? "",
      database: e.DB_NAME,
    };
  }

  /* Tier 4 — Build-time dummy (static analysis only) */
  return BUILD_DUMMY;
}

function createPrismaClient(): PrismaClient {
  const cfg = resolveConfig();

  const adapter = new PrismaMariaDb({
    host:            cfg.host,
    port:            cfg.port,
    user:            cfg.user,
    password:        cfg.password,
    database:        cfg.database,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE       ?? "5",  10),
    connectTimeout:  parseInt(process.env.DB_CONNECT_TIMEOUT ?? "10", 10),
  });

  return new PrismaClient({ adapter });
}

/* ── Singleton — one client for the entire process lifetime ── */
const g = globalThis as unknown as { _prisma?: PrismaClient };
export const db: PrismaClient = g._prisma ?? (g._prisma = createPrismaClient());
