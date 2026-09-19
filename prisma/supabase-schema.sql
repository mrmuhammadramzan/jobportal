-- RozeDesk — Complete schema SQL
-- Paste into Supabase SQL Editor → Run without RLS

-- ── Enums ──────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('SEEKER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DRAFT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM (
    'PENDING_PAYMENT', 'PAYMENT_UNDER_REVIEW', 'PAYMENT_REJECTED',
    'CV_UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'HIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('JAZZCASH', 'EASYPAISA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "users" (
  "id"           TEXT        NOT NULL PRIMARY KEY,
  "name"         TEXT        NOT NULL,
  "email"        TEXT        NOT NULL UNIQUE,
  "passwordHash" TEXT        NOT NULL,
  "role"         "Role"      NOT NULL DEFAULT 'SEEKER',
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seeker Profiles ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "seeker_profiles" (
  "id"            TEXT        NOT NULL PRIMARY KEY,
  "userId"        TEXT        NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "phone"         TEXT,
  "location"      TEXT,
  "summary"       TEXT,
  "skills"        TEXT[]      NOT NULL DEFAULT '{}',
  "jobType"       TEXT,
  "desiredSalary" TEXT,
  "remotePref"    TEXT,
  "cvUrl"         TEXT,
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Jobs ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "jobs" (
  "id"           TEXT         NOT NULL PRIMARY KEY,
  "title"        TEXT         NOT NULL,
  "company"      TEXT         NOT NULL,
  "location"     TEXT         NOT NULL,
  "type"         TEXT         NOT NULL,
  "category"     TEXT         NOT NULL,
  "description"  TEXT         NOT NULL,
  "requirements" TEXT[]       NOT NULL DEFAULT '{}',
  "benefits"     TEXT[]       NOT NULL DEFAULT '{}',
  "salaryMin"    INTEGER,
  "salaryMax"    INTEGER,
  "deadline"     TIMESTAMPTZ,
  "status"       "JobStatus"  NOT NULL DEFAULT 'ACTIVE',
  "createdAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Applications ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "applications" (
  "id"        TEXT                NOT NULL PRIMARY KEY,
  "userId"    TEXT                NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "jobId"     TEXT                NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
  "cvUrl"     TEXT                NOT NULL,
  "status"    "ApplicationStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "createdAt" TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "jobId")
);

-- ── Payments ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "payments" (
  "id"              TEXT            NOT NULL PRIMARY KEY,
  "applicationId"   TEXT            NOT NULL UNIQUE REFERENCES "applications"("id") ON DELETE CASCADE,
  "amount"          INTEGER         NOT NULL,
  "method"          "PaymentMethod" NOT NULL,
  "receiptUrl"      TEXT            NOT NULL,
  "receiptRef"      TEXT,
  "status"          "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "rejectionReason" TEXT,
  "submittedAt"     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "reviewedAt"      TIMESTAMPTZ,
  "reviewedBy"      TEXT
);

-- ── Payment Settings ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "payment_settings" (
  "id"        TEXT        NOT NULL PRIMARY KEY,
  "method"    TEXT        NOT NULL UNIQUE,
  "phone"     TEXT        NOT NULL,
  "name"      TEXT        NOT NULL,
  "address"   TEXT,
  "active"    BOOLEAN     NOT NULL DEFAULT TRUE,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Saved Jobs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "saved_jobs" (
  "id"      TEXT        NOT NULL PRIMARY KEY,
  "userId"  TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "jobId"   TEXT        NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
  "savedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "jobId")
);

-- ── Alerts ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "alerts" (
  "id"        TEXT        NOT NULL PRIMARY KEY,
  "userId"    TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "keywords"  TEXT        NOT NULL,
  "location"  TEXT        NOT NULL DEFAULT 'Any',
  "type"      TEXT        NOT NULL DEFAULT 'Any',
  "frequency" TEXT        NOT NULL DEFAULT 'Daily',
  "active"    BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Analytics Summaries ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "analytics_summaries" (
  "id"           TEXT        NOT NULL PRIMARY KEY,
  "date"         TIMESTAMPTZ NOT NULL UNIQUE,
  "visitors"     INTEGER     NOT NULL DEFAULT 0,
  "pageViews"    INTEGER     NOT NULL DEFAULT 0,
  "applications" INTEGER     NOT NULL DEFAULT 0,
  "newUsers"     INTEGER     NOT NULL DEFAULT 0
);

-- ── Seed: Admin user (password: Admin@1234) ─────────────────────────────────

INSERT INTO "users" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES (
  'admin_rozedesk_001',
  'Super Admin',
  'admin@rozedesk.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uA.m',
  'ADMIN',
  NOW(), NOW()
) ON CONFLICT ("email") DO NOTHING;

-- ── Seed: Payment settings ──────────────────────────────────────────────────

INSERT INTO "payment_settings" ("id", "method", "phone", "name", "address", "active", "updatedAt")
VALUES
  ('ps_jazzcash_001',  'JazzCash',  '03001234567', 'RozeDesk Payments', 'Lahore, Pakistan', TRUE, NOW()),
  ('ps_easypaisa_001', 'Easypaisa', '03111234567', 'RozeDesk Payments', 'Lahore, Pakistan', TRUE, NOW())
ON CONFLICT ("method") DO NOTHING;

-- ── Seed: Sample jobs ───────────────────────────────────────────────────────

INSERT INTO "jobs" ("id","title","company","location","type","category","description","requirements","benefits","salaryMin","salaryMax","status","createdAt","updatedAt")
VALUES
  ('job_001','React Developer',    'Systems Ltd',        'Lahore',   'Full-time','Technology','Skilled React Developer for building scalable web apps.',   ARRAY['3+ years React','TypeScript','REST APIs','Git'],        ARRAY['Competitive salary','Remote-friendly','Annual bonus','Health insurance'],80000, 130000,'ACTIVE',NOW(),NOW()),
  ('job_002','UI/UX Designer',     'Arbisoft',           'Remote',   'Full-time','Design',    'Create beautiful, functional interfaces for our platform.',  ARRAY['3+ years UI/UX','Figma','User research','Design systems'],ARRAY['Fully remote','Flexible hours','MacBook provided','Annual retreat'],    70000, 110000,'ACTIVE',NOW(),NOW()),
  ('job_003','Marketing Executive','Gaditek',            'Karachi',  'Full-time','Marketing', 'Drive growth through digital marketing campaigns.',          ARRAY['2+ years digital marketing','Google Ads','Analytics'],   ARRAY['Market salary','Travel allowance','Training budget'],                 60000,  90000,'ACTIVE',NOW(),NOW()),
  ('job_004','Node.js Engineer',   '10Pearls',           'Islamabad','Full-time','Technology','Build scalable backend services and APIs.',                  ARRAY['4+ years Node.js','PostgreSQL','REST & GraphQL','Docker'],ARRAY['Top salary','Stock options','Paid learning','Medical'],               100000,160000,'ACTIVE',NOW(),NOW()),
  ('job_005','Product Manager',    'Netsol Technologies','Lahore',   'Full-time','Technology','Define product strategy for our fintech platform.',          ARRAY['5+ years PM','Agile/Scrum','Data-driven'],               ARRAY['Excellent salary','ESOP','International exposure'],                  120000,200000,'ACTIVE',NOW(),NOW()),
  ('job_006','Content Writer',     'Contour Software',   'Remote',   'Part-time','Marketing', 'Create engaging blog posts and social media content.',       ARRAY['2+ years writing','SEO knowledge','Tech interest'],      ARRAY['Flexible hours','Remote','Contract-based'],                           30000,  50000,'ACTIVE',NOW(),NOW())
ON CONFLICT ("id") DO NOTHING;

SELECT 'RozeDesk schema + seed complete' AS status;
