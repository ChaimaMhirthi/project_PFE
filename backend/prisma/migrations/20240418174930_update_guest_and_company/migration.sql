/*
  Warnings:

  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `company` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `guest` ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `invitation` MODIFY `privilege` ENUM('RO', 'RW', 'RWC') NOT NULL;
