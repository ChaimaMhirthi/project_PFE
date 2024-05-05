/*
  Warnings:

  - You are about to drop the column `otpExpiry` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `otpExpiry`,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `otpExpiry`,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
