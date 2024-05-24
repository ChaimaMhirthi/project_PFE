/*
  Warnings:

  - You are about to drop the column `mediaentryfinished` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `mediaentryfinished`,
    ADD COLUMN `dataCollectionDone` BOOLEAN NULL DEFAULT false;
