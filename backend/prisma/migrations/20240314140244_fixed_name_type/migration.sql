/*
  Warnings:

  - You are about to drop the column `Username` on the `adminaccount` table. All the data in the column will be lost.
  - Added the required column `username` to the `AdminAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminaccount` DROP COLUMN `Username`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;
