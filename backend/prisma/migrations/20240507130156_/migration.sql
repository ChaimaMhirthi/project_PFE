-- AlterTable
ALTER TABLE `company` MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
