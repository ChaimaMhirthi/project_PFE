/*
  Warnings:

  - You are about to drop the column `description` on the `damage` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `manager` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `manager` table. All the data in the column will be lost.
  - You are about to drop the column `manager` on the `manager` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Token]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyname]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Token]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyname` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enddate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startdate` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_damageId_fkey`;

-- AlterTable
ALTER TABLE `damage` DROP COLUMN `description`,
    ADD COLUMN `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `Token` VARCHAR(191) NULL,
    ADD COLUMN `TokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `accountVerified` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    ADD COLUMN `status` INTEGER NULL DEFAULT 0,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `manager` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `manager`,
    ADD COLUMN `Token` VARCHAR(191) NULL,
    ADD COLUMN `TokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `accountVerified` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `companyname` VARCHAR(191) NOT NULL,
    ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    ADD COLUMN `status` INTEGER NULL DEFAULT 0,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `enddate` DATETIME(3) NOT NULL,
    ADD COLUMN `mediaentryfinished` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `startdate` DATETIME(3) NOT NULL,
    MODIFY `status` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SuperAdmin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AiProcessingProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishTime` DATETIME(3) NULL,
    `status` BOOLEAN NULL DEFAULT false,
    `projectId` INTEGER NOT NULL,

    UNIQUE INDEX `AiProcessingProject_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_Token_key` ON `Employee`(`Token`);

-- CreateIndex
CREATE UNIQUE INDEX `Manager_companyname_key` ON `Manager`(`companyname`);

-- CreateIndex
CREATE UNIQUE INDEX `Manager_Token_key` ON `Manager`(`Token`);

-- AddForeignKey
ALTER TABLE `AiProcessingProject` ADD CONSTRAINT `AiProcessingProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
