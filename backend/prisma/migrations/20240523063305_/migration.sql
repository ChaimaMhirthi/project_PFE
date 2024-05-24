/*
  Warnings:

  - Added the required column `creatorType` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mission` ADD COLUMN `creatorType` VARCHAR(191) NOT NULL;
