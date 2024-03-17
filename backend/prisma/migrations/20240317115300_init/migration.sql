-- CreateTable
CREATE TABLE `AdminAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `locationAdress` VARCHAR(191) NULL,
    `thumbnail` JSON NULL,
    `registerTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('ADMIN', 'GUEST') NOT NULL DEFAULT 'ADMIN',
    `inspectionProjectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NULL,
    `professionalExperiences` JSON NULL,
    `profession` VARCHAR(191) NULL,
    `aboutMe` VARCHAR(191) NULL,
    `thumbnail` JSON NULL,
    `role` ENUM('ADMIN', 'GUEST') NOT NULL DEFAULT 'GUEST',
    `adminAccountid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guest_AdminAccount_Relation` (
    `accessRight` ENUM('ReadOnly', 'ReadWrite') NOT NULL,
    `authorized` BOOLEAN NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `authorizedProjects` VARCHAR(191) NOT NULL,
    `guestId` INTEGER NOT NULL,
    `adminAccountId` INTEGER NOT NULL,

    PRIMARY KEY (`guestId`, `adminAccountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Infrastructure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `locationAdresse` JSON NULL,
    `constructionDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspectionProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `thumbnail` JSON NULL,
    `InfrastructureId` INTEGER NOT NULL,
    `AdminAccountId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Damage` (
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
    `inspectionProjectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspectionRapport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `creationDate` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NULL,
    `InspectionProjectID` INTEGER NOT NULL,

    UNIQUE INDEX `InspectionRapport_InspectionProjectID_key`(`InspectionProjectID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaInput` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `addedDate` DATETIME(3) NULL,
    `projectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoInspection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `frameRate` DOUBLE NULL,
    `length` DATETIME(3) NULL,
    `mediaInputId` INTEGER NOT NULL,
    `inspectionProjectId` INTEGER NOT NULL,

    UNIQUE INDEX `VideoInspection_mediaInputId_key`(`mediaInputId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageInspection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspectionProjectId` INTEGER NOT NULL,
    `mediaInputId` INTEGER NOT NULL,

    UNIQUE INDEX `ImageInspection_mediaInputId_key`(`mediaInputId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightPathDrone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` JSON NULL,
    `mediaInputId` INTEGER NOT NULL,
    `inspectionProjectId` INTEGER NOT NULL,

    UNIQUE INDEX `FlightPathDrone_mediaInputId_key`(`mediaInputId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guest` ADD CONSTRAINT `Guest_adminAccountid_fkey` FOREIGN KEY (`adminAccountid`) REFERENCES `AdminAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guest_AdminAccount_Relation` ADD CONSTRAINT `Guest_AdminAccount_Relation_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guest_AdminAccount_Relation` ADD CONSTRAINT `Guest_AdminAccount_Relation_adminAccountId_fkey` FOREIGN KEY (`adminAccountId`) REFERENCES `AdminAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionProject` ADD CONSTRAINT `InspectionProject_AdminAccountId_fkey` FOREIGN KEY (`AdminAccountId`) REFERENCES `AdminAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionProject` ADD CONSTRAINT `InspectionProject_InfrastructureId_fkey` FOREIGN KEY (`InfrastructureId`) REFERENCES `Infrastructure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Damage` ADD CONSTRAINT `Damage_inspectionProjectId_fkey` FOREIGN KEY (`inspectionProjectId`) REFERENCES `InspectionProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionRapport` ADD CONSTRAINT `InspectionRapport_InspectionProjectID_fkey` FOREIGN KEY (`InspectionProjectID`) REFERENCES `InspectionProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaInput` ADD CONSTRAINT `MediaInput_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `InspectionProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoInspection` ADD CONSTRAINT `VideoInspection_mediaInputId_fkey` FOREIGN KEY (`mediaInputId`) REFERENCES `MediaInput`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageInspection` ADD CONSTRAINT `ImageInspection_mediaInputId_fkey` FOREIGN KEY (`mediaInputId`) REFERENCES `MediaInput`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightPathDrone` ADD CONSTRAINT `FlightPathDrone_mediaInputId_fkey` FOREIGN KEY (`mediaInputId`) REFERENCES `MediaInput`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
