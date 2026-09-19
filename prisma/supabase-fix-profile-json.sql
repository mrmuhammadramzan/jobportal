-- Fix: change education/experience from JSONB[] to JSONB
-- Prisma 7 Json type maps to JSONB (single column), not JSONB[] (array of columns)
-- Also reset any corrupted data from the failed writes

-- Drop and recreate as single JSONB column (not array)
ALTER TABLE "seeker_profiles" DROP COLUMN IF EXISTS "education";
ALTER TABLE "seeker_profiles" DROP COLUMN IF EXISTS "experience";
ALTER TABLE "seeker_profiles"
  ADD COLUMN "education"  JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN "experience" JSONB NOT NULL DEFAULT '[]'::jsonb;

SELECT 'Profile JSON columns fixed' AS status;
