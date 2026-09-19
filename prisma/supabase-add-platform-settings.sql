-- Platform settings key-value store
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "platform_settings" (
  "key"       TEXT        NOT NULL PRIMARY KEY,
  "value"     TEXT        NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed defaults
INSERT INTO "platform_settings" ("key", "value", "updatedAt") VALUES
  ('siteName',     'RozeDesk',                        NOW()),
  ('tagline',      'Find your next job in Pakistan',   NOW()),
  ('contactEmail', 'hello@rozedesk.com',               NOW()),
  ('notifNew',     'true',                             NOW()),
  ('notifShortlist','true',                            NOW()),
  ('notifWeekly',  'false',                            NOW())
ON CONFLICT ("key") DO NOTHING;

SELECT 'Platform settings table created' AS status;

-- Add appFee to platform_settings
INSERT INTO "platform_settings" ("key", "value", "updatedAt")
VALUES ('appFee', '150', NOW())
ON CONFLICT ("key") DO NOTHING;
