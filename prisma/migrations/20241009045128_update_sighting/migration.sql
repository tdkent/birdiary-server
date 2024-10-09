/*
  Warnings:

  - Made the column `desc` on table `Sighting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sighting" ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "desc" SET NOT NULL;
