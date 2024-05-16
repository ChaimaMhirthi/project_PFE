/*
  Warnings:

  - You are about to drop the column `superAdminId` on the `company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_superAdminId_fkey`;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `superAdminId`;

-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
