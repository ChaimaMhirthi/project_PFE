-- AlterTable
ALTER TABLE `company` ADD COLUMN `accountVerified` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `otp` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `accountVerified` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `mediaentryfinished` BOOLEAN NULL DEFAULT false;

-- CreateTable
CREATE TABLE `AiProcessingProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishTime` DATETIME(3) NULL,
    `status` BOOLEAN NULL DEFAULT false,
    `projectId` INTEGER NOT NULL,

    UNIQUE INDEX `AiProcessingProject_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AiProcessingProject` ADD CONSTRAINT `AiProcessingProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
