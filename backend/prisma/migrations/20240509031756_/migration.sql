-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `project` MODIFY `status` INTEGER NULL DEFAULT 0;
