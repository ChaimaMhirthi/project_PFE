/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_resetToken_key` ON `Employee`(`resetToken`);
