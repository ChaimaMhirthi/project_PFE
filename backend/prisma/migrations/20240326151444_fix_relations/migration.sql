/*
  Warnings:

  - You are about to drop the `damagetmage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `damagetmage` DROP FOREIGN KEY `DamageTmage_ProjectId_fkey`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `DamageImageId` INTEGER NULL;

-- DropTable
DROP TABLE `damagetmage`;

-- CreateTable
CREATE TABLE `DamageImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `dangerDegree` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `videoFrameNumber` INTEGER NOT NULL,
    `damageImagename` VARCHAR(191) NULL,
    `damageImageCroppedname` VARCHAR(191) NULL,
    `imagesPath` VARCHAR(191) NULL,
    `modelPrediction` INTEGER NULL,
    `DomageIdModel` INTEGER NULL,
    `DamageClassIdModel` INTEGER NULL,
    `detectionTimestampVideo` DATETIME(3) NULL,
    `ProjectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_DamageImageId_fkey` FOREIGN KEY (`DamageImageId`) REFERENCES `DamageImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageImage` ADD CONSTRAINT `DamageImage_ProjectId_fkey` FOREIGN KEY (`ProjectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
