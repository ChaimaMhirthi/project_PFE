/*
  Warnings:

  - You are about to drop the column `description` on the `damage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_damageId_fkey`;

-- AlterTable
ALTER TABLE `damage` DROP COLUMN `description`,
    ADD COLUMN `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;
