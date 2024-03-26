/*
  Warnings:

  - You are about to drop the `commentaire` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `commentaire`;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DamageTmage` (
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
ALTER TABLE `DamageTmage` ADD CONSTRAINT `DamageTmage_ProjectId_fkey` FOREIGN KEY (`ProjectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
