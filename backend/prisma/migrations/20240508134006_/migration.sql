/*
  Warnings:

  - Added the required column `enddate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startdate` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ALTER COLUMN `resetTokenExpiresAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `enddate` DATETIME(3) NOT NULL,
    ADD COLUMN `startdate` DATETIME(3) NOT NULL;
