/*
  Warnings:

  - You are about to drop the column `company` on the `company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyname]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyname` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superAdminId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Comment_damageId_fkey` ON `comment`;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `company`,
    ADD COLUMN `companyname` VARCHAR(191) NOT NULL,
    ADD COLUMN `superAdminId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `status` INTEGER NULL DEFAULT 0,
    ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SuperAdmin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Company_companyname_key` ON `Company`(`companyname`);

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_superAdminId_fkey` FOREIGN KEY (`superAdminId`) REFERENCES `SuperAdmin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
