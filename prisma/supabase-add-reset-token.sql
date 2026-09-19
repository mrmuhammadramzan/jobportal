-- Add password reset token columns to users table
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "resetToken"       TEXT,
  ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMPTZ;

SELECT 'Reset token columns added' AS status;
