-- Add extended profile fields to seeker_profiles
-- Run in Supabase SQL Editor

ALTER TABLE "seeker_profiles"
  ADD COLUMN IF NOT EXISTS "linkedin"        TEXT,
  ADD COLUMN IF NOT EXISTS "github"          TEXT,
  ADD COLUMN IF NOT EXISTS "portfolio"       TEXT,
  ADD COLUMN IF NOT EXISTS "education"       JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "experience"      JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "currentProject"  TEXT;

SELECT 'Profile fields added' AS status;
