-- RozeDesk MySQL Schema — paste into Railway MySQL Console
-- Run: mysql -u root -phgIYcsnbmGPsxvlRoyXsQNUYYBkEoVoS railway
-- Then paste everything below this line

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('SEEKER','ADMIN') NOT NULL DEFAULT 'SEEKER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `resetToken` VARCHAR(191) NULL,
  `resetTokenExpiry` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seeker_profiles` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `location` VARCHAR(191) NULL,
  `summary` TEXT NULL,
  `skills` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `linkedin` VARCHAR(191) NULL,
  `github` VARCHAR(191) NULL,
  `portfolio` VARCHAR(191) NULL,
  `education` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `experience` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `currentProject` TEXT NULL,
  `jobType` VARCHAR(191) NULL,
  `desiredSalary` VARCHAR(191) NULL,
  `remotePref` VARCHAR(191) NULL,
  `cvUrl` VARCHAR(191) NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `seeker_profiles_userId_key` (`userId`),
  CONSTRAINT `seeker_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `company` VARCHAR(191) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `benefits` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  `salaryMin` INT NULL,
  `salaryMax` INT NULL,
  `deadline` DATETIME(3) NULL,
  `status` ENUM('ACTIVE','CLOSED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `applications` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `jobId` VARCHAR(191) NOT NULL,
  `cvUrl` TEXT NOT NULL,
  `status` ENUM('PENDING_PAYMENT','PAYMENT_UNDER_REVIEW','PAYMENT_REJECTED','CV_UNDER_REVIEW','SHORTLISTED','REJECTED','HIRED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `applications_userId_jobId_key` (`userId`,`jobId`),
  CONSTRAINT `applications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(191) NOT NULL,
  `applicationId` VARCHAR(191) NOT NULL,
  `amount` INT NOT NULL,
  `method` ENUM('JAZZCASH','EASYPAISA') NOT NULL,
  `receiptUrl` TEXT NOT NULL,
  `receiptRef` VARCHAR(191) NULL,
  `status` ENUM('PENDING','APPROVED','REJECTED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `rejectionReason` TEXT NULL,
  `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewedAt` DATETIME(3) NULL,
  `reviewedBy` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_applicationId_key` (`applicationId`),
  CONSTRAINT `payments_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment_settings` (
  `id` VARCHAR(191) NOT NULL,
  `method` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_settings_method_key` (`method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `saved_jobs` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `jobId` VARCHAR(191) NOT NULL,
  `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `saved_jobs_userId_jobId_key` (`userId`,`jobId`),
  CONSTRAINT `saved_jobs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saved_jobs_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `alerts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `keywords` VARCHAR(191) NOT NULL,
  `location` VARCHAR(191) NOT NULL DEFAULT 'Any',
  `type` VARCHAR(191) NOT NULL DEFAULT 'Any',
  `frequency` VARCHAR(191) NOT NULL DEFAULT 'Daily',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `alerts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `analytics_summaries` (
  `id` VARCHAR(191) NOT NULL,
  `date` DATETIME(3) NOT NULL,
  `visitors` INT NOT NULL DEFAULT 0,
  `pageViews` INT NOT NULL DEFAULT 0,
  `applications` INT NOT NULL DEFAULT 0,
  `newUsers` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `analytics_summaries_date_key` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `body` TEXT NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'info',
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `link` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `notifications_userId_read_idx` (`userId`,`read`),
  CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `platform_settings` (
  `key` VARCHAR(191) NOT NULL,
  `value` TEXT NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `platform_settings` (`key`, `value`, `updatedAt`) VALUES
  ('appFee', '150', NOW()),
  ('platformCut', '15', NOW());

SHOW TABLES;
SELECT 'Schema ready!' AS result;
