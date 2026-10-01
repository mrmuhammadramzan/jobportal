-- ─────────────────────────────────────────────────────────────────────
-- GameWithdrawal migration — FlappyWin
-- Run: Get-Content "..." | & "C:\xampp\mysql\bin\mysql.exe" -u root rozedesk
-- DBA SOP §5: forward + rollback at bottom
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `game_withdrawals` (
  `id`              VARCHAR(191)                              NOT NULL,
  `walletId`        VARCHAR(191)                              NOT NULL,
  `userId`          VARCHAR(191)                              NOT NULL,
  `amount`          INT                                       NOT NULL,
  `method`          VARCHAR(50)                               NOT NULL,
  `accountNumber`   VARCHAR(100)                              NOT NULL,
  `accountName`     VARCHAR(191)                              NOT NULL,
  `status`          ENUM('PENDING','APPROVED','REJECTED')     NOT NULL DEFAULT 'PENDING',
  `rejectionReason` TEXT                                      NULL,
  `submittedAt`     DATETIME(3)                               NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewedAt`      DATETIME(3)                               NULL,
  `reviewedBy`      VARCHAR(191)                              NULL,
  PRIMARY KEY (`id`),
  INDEX `game_withdrawals_userId_idx`  (`userId`),
  INDEX `game_withdrawals_status_idx`  (`status`),
  CONSTRAINT `game_withdrawals_walletId_fkey`
    FOREIGN KEY (`walletId`) REFERENCES `game_wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ROLLBACK:
-- DROP TABLE IF EXISTS `game_withdrawals`;
