-- Migration: add phone field to users table
-- Safe to run on existing DB: NULL default means all existing rows unaffected.
-- Unique constraint prevents duplicate phone numbers.

ALTER TABLE `users`
  ADD COLUMN `phone` VARCHAR(20) NULL AFTER `email`,
  ADD UNIQUE KEY `users_phone_key` (`phone`);
