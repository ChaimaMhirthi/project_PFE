-- AlterTable
ALTER TABLE `company` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiresAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiry` DATETIME(3) NULL,
    ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
