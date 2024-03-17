/*
  Warnings:

  - You are about to drop the `adminaccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `damage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flightpathdrone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guest_adminaccount_relation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imageinspection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `infrastructure` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inspectionproject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inspectionrapport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mediainput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `videoinspection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `damage` DROP FOREIGN KEY `Damage_inspectionProjectId_fkey`;

-- DropForeignKey
ALTER TABLE `flightpathdrone` DROP FOREIGN KEY `FlightPathDrone_mediaInputId_fkey`;

-- DropForeignKey
ALTER TABLE `guest` DROP FOREIGN KEY `Guest_adminAccountid_fkey`;

-- DropForeignKey
ALTER TABLE `guest_adminaccount_relation` DROP FOREIGN KEY `Guest_AdminAccount_Relation_adminAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `guest_adminaccount_relation` DROP FOREIGN KEY `Guest_AdminAccount_Relation_guestId_fkey`;

-- DropForeignKey
ALTER TABLE `imageinspection` DROP FOREIGN KEY `ImageInspection_mediaInputId_fkey`;

-- DropForeignKey
ALTER TABLE `inspectionproject` DROP FOREIGN KEY `InspectionProject_AdminAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `inspectionproject` DROP FOREIGN KEY `InspectionProject_InfrastructureId_fkey`;

-- DropForeignKey
ALTER TABLE `inspectionrapport` DROP FOREIGN KEY `InspectionRapport_InspectionProjectID_fkey`;

-- DropForeignKey
ALTER TABLE `mediainput` DROP FOREIGN KEY `MediaInput_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `videoinspection` DROP FOREIGN KEY `VideoInspection_mediaInputId_fkey`;

-- DropTable
DROP TABLE `adminaccount`;

-- DropTable
DROP TABLE `damage`;

-- DropTable
DROP TABLE `flightpathdrone`;

-- DropTable
DROP TABLE `guest`;

-- DropTable
DROP TABLE `guest_adminaccount_relation`;

-- DropTable
DROP TABLE `imageinspection`;

-- DropTable
DROP TABLE `infrastructure`;

-- DropTable
DROP TABLE `inspectionproject`;

-- DropTable
DROP TABLE `inspectionrapport`;

-- DropTable
DROP TABLE `mediainput`;

-- DropTable
DROP TABLE `videoinspection`;

-- CreateTable
CREATE TABLE `AcountCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
