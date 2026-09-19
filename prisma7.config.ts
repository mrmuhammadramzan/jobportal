// prisma7.config.ts
// Switched to MySQL (XAMPP). No directUrl needed for MySQL.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});
