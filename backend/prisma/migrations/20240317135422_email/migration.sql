/*
  Warnings:

  - You are about to drop the column `mail` on the `acountcompany` table. All the data in the column will be lost.
  - Added the required column `email` to the `AcountCompany` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `acountcompany` DROP COLUMN `mail`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;