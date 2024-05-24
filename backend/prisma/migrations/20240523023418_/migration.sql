/*
  Warnings:

  - You are about to drop the column `projectManagerId` on the `mission` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mission` DROP FOREIGN KEY `Mission_projectManagerId_fkey`;

-- AlterTable
ALTER TABLE `mission` DROP COLUMN `projectManagerId`,
    ADD COLUMN `employeeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
