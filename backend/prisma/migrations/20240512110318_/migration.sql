-- AlterTable
ALTER TABLE `company` ADD COLUMN `status` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
