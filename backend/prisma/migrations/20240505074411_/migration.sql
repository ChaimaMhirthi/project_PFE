/*
  Warnings:

  - Added the required column `resetToken` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `resetToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `resetTokenExpiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
