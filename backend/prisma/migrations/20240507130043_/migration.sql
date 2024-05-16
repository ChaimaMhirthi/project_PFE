-- AlterTable
ALTER TABLE `employee` MODIFY `phone` VARCHAR(191) NULL,
    ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
