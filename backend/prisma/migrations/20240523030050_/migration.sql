/*
  Warnings:

  - Added the required column `creatorId` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mission` ADD COLUMN `creatorId` INTEGER NOT NULL;
