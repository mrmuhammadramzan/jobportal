// prisma7.config.ts — Prisma 7 datasource config.
// Supports Railway MySQL (MYSQL_URL / individual vars) and local dev (DATABASE_URL).
//
// Resolution order (mirrors db.ts — single source of truth logic):
//   1. Compose URL from Railway individual vars: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD,
//      MYSQLPORT, MYSQLDATABASE — Railway MySQL plugin sets these automatically.
//   2. MYSQL_URL — set by Railway's MySQL plugin as a pre-resolved connection string.
//   3. DATABASE_URL — standard local dev / custom hosting value.
//
// DevOps SOP Hard Rule 1: no credentials in source — everything from env.
import "dotenv/config";
import { defineConfig } from "prisma/config";

function resolveDatasourceUrl(): string {
  const e = process.env;

  /* Tier 1: Railway individual vars → compose standard mysql:// URL */
  if (e.MYSQLHOST && e.MYSQLDATABASE) {
    const user = encodeURIComponent(e.MYSQLUSER     ?? "root");
    const pass = encodeURIComponent(e.MYSQLPASSWORD ?? "");
    const host = e.MYSQLHOST;
    const port = e.MYSQLPORT ?? "3306";
    const db   = e.MYSQLDATABASE;
    return `mysql://${user}:${pass}@${host}:${port}/${db}`;
  }

  /* Tier 2: Railway pre-resolved MYSQL_URL */
  if (e.MYSQL_URL) return e.MYSQL_URL;

  /* Tier 3: Standard DATABASE_URL (local dev / other hosting) */
  if (e.DATABASE_URL) return e.DATABASE_URL;

  /* Tier 4: Build-time safety net.
     - During `prisma generate` (build phase): DB vars are absent by design — no connection
       is made, so returning a dummy URL is safe. Prisma generate only reads the schema.
     - During `prisma db push` (start phase): if we reach here, it's a misconfiguration.
       But the start command always passes --url on the CLI which overrides this value,
       so this path is never reached at runtime either.
     Conclusion: the dummy is safe here — it is always overridden before any real connection. */
  return "mysql://build:dummy@localhost:3306/build";
}

export default defineConfig({
  schema:     "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: resolveDatasourceUrl(),
  },
});
