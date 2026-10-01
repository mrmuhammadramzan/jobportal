-- ─────────────────────────────────────────────────────────────────────────────
-- Game Tables Migration — RozeDesk Flappy Bird Earning Game
-- Run manually: mysql -u root rozedesk < prisma/migrations/game-tables.sql
-- DBA SOP §5: forward migration + commented rollback at the bottom
-- ─────────────────────────────────────────────────────────────────────────────

-- ENUM: game_deposit_status
-- MySQL does not support ALTER TYPE; we define inline in the column below.

CREATE TABLE IF NOT EXISTS `game_wallets` (
  `id`        VARCHAR(191) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `balance`   INT          NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_wallets_userId_key` (`userId`),
  CONSTRAINT `game_wallets_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_deposits` (
  `id`              VARCHAR(191) NOT NULL,
  `walletId`        VARCHAR(191) NOT NULL,
  `userId`          VARCHAR(191) NOT NULL,
  `amount`          INT          NOT NULL,
  `method`          ENUM('JAZZCASH','EASYPAISA') NOT NULL,
  `screenshotUrl`   LONGTEXT     NOT NULL,
  `status`          ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `rejectionReason` TEXT         NULL,
  `submittedAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewedAt`      DATETIME(3)  NULL,
  `reviewedBy`      VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  INDEX `game_deposits_userId_idx` (`userId`),
  INDEX `game_deposits_status_idx` (`status`),
  CONSTRAINT `game_deposits_walletId_fkey`
    FOREIGN KEY (`walletId`) REFERENCES `game_wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game_sessions` (
  `id`          VARCHAR(191) NOT NULL,
  `walletId`    VARCHAR(191) NOT NULL,
  `userId`      VARCHAR(191) NOT NULL,
  `wagerAmount` INT          NOT NULL,
  `finalScore`  INT          NOT NULL DEFAULT 0,
  `winAmount`   INT          NOT NULL DEFAULT 0,
  `milestones`  JSON         NOT NULL DEFAULT (JSON_ARRAY()),
  `startedAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endedAt`     DATETIME(3)  NULL,
  `completed`   TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `game_sessions_userId_idx` (`userId`),
  CONSTRAINT `game_sessions_walletId_fkey`
    FOREIGN KEY (`walletId`) REFERENCES `game_wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- ROLLBACK (run if you need to revert — DBA SOP §5.1)
-- ─────────────────────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS `game_sessions`;
-- DROP TABLE IF EXISTS `game_deposits`;
-- DROP TABLE IF EXISTS `game_wallets`;
